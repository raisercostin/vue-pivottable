import defaultProps from "./helper/defaultProps";
import DraggableAttribute from "./DraggableAttribute";
import Dropdown from "./Dropdown";
import Single from "./Single";
import Header from "./Header";
import SaveBtn from "./SaveBtn";
import Pivottable from "./Pivottable";
import { PivotData, getSort, aggregators, sortAs } from "./helper/utils";
import draggable from "vuedraggable";
import TableRenderer from "./TableRenderer";
import PlotlyRenderer from "./PlotlyRenderer";
import $ from "jquery";

export default {
  name: "vue-pivottable-ui",
  mixins: [defaultProps],
  props: {
    tableMaxWidth: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >= 0;
      },
    },
    hiddenAttributes: {
      type: Array,
      default: function () {
        return [];
      },
    },
    hiddenFromAggregators: {
      type: Array,
      default: function () {
        return [];
      },
    },
    defaultAggregatorName: String,
    defaultVals: {
      type: Array,
      default: function () {
        return [];
      },
    },
    defaultTables: {
      type: Array,
      default: function () {
        return [];
      },
    },
    defaultColumns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    defaultRows: {
      type: Array,
      default: function () {
        return [];
      },
    },
    defaultValueFilter: {
      type: Object,
      default: function () {
        return {};
      },
    },
    fields: {
      type: Array,
      default: function () {
        return [];
      },
    },
    sortonlyFromDragDrop: {
      type: Array,
      default: function () {
        return [];
      },
    },
    disabledFromDragDrop: {
      type: Array,
      default: function () {
        return [];
      },
    },
    menuLimit: {
      type: Number,
      default: 500,
    },
    showRenderers: {
      type: Array,
      default: function () {
        return [];
      },
    },
    showAggregators: {
      type: Array,
      default: function () {
        return [];
      },
    },
    showTemplates: {
      type: Array,
      default: function () {
        return [];
      },
    },
    roleCreate: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    roleEditDelete: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    clear: {
      type: Boolean,
      default: function () {
        return false;
      },
    }
  },
  computed: {
    innerAggregatorName() {
      return this.propsData.aggregatorName;
    },
    innerVals() {
      return this.propsData.vals;
    },
    innerTables() {
      return this.propsData.table;
    },
    innerRows() {
      return this.propsData.rows;
    },
    innerColumns() {
      return this.propsData.cols;
    },
    innerValueFilter() {
      return this.propsData.valueFilter;
    },
    renderers() {
      var res = Object.assign({}, TableRenderer, PlotlyRenderer);
      var result = this.showRenderers.length == 0 ? res : {};
      for (var i = 0; i < this.showRenderers.length; i++) {
        result[this.showRenderers[i]] = res[this.showRenderers[i]];
      }
      return result;
    },
    customAggregators() {
      var res = Object.assign({}, aggregators);
      var result = this.showAggregators.length == 0 ? res : {};
      for (var i = 0; i < this.showAggregators.length; i++) {
        result[this.showAggregators[i]] = res[this.showAggregators[i]];
      }
      return result;
    },
    numValsAllowed() {
      return (
        aggregators[
          this.propsData.aggregatorName || this.defaultAggregatorName
        ]([])().numInputs || 0
      );
    },
    rowAttrs() {
      return this.propsData.rows.filter(
        (e) => !this.hiddenAttributes.includes(e)
      );
    },
    colAttrs() {
      return this.propsData.cols.filter(
        (e) => !this.hiddenAttributes.includes(e)
      );
    },
    unusedAttrs() {
      return this.propsData.table.filter(
        (e) => !this.hiddenAttributes.includes(e)
      );
    },
  },
  data() {
    return {
      propsData: {
        aggregatorName: "",
        rendererName: "",
        rowOrder: "key_a_to_z",
        colOrder: "key_a_to_z",
        data: [],
        vals: [],
        cols: [],
        rows: [],
        valueFilter: {},
        renderer: null,
        table: [],
      },
      existing: {},
      dragging: false,
      currentOpen: "",
      attrValues: {},
      unusedOrder: [],
      zIndices: {},
      maxZIndex: 1000,
      openDropdown: false,
      materializedInput: [],
      sortIcons: {
        key_a_to_z: {
          rowSymbol: "↕",
          colSymbol: "↔",
          next: "value_a_to_z",
        },
        value_a_to_z: {
          rowSymbol: "↓",
          colSymbol: "→",
          next: "value_z_to_a",
        },
        value_z_to_a: {
          rowSymbol: "↑",
          colSymbol: "←",
          next: "key_a_to_z",
        },
      },
    };
  },
  beforeUpdated(nextProps) {
    this.materializeInput(nextProps.data);
  },
  created() {
    this.init();
  },
  watch: {
    clear() {
      if (this.clear) {
        this.existing = []
      }
    },
    innerAggregatorName: {
      handler: function (newValue) {
        if (Object.keys(this.existing).length > 0 && !(this.existing.aggreatorName == newValue)) {
          this.$emit("hasChanges", true);
        } else if (Object.keys(this.existing).length == 0 && newValue != this.defaultAggregatorName) {
          this.$emit("hasChanges", true);
        }
      },
      deep: true,
    },
    innerVals: {
      handler: function (newValue) {
        if (Object.keys(this.existing).length > 0 && !this.checkLists(this.existing.values, newValue)) {
          this.$emit("hasChanges", true);
        } else if (Object.keys(this.existing).length == 0 && newValue.length > 0) this.$emit("hasChanges", true);
      },
      deep: true,
    },
    innerTables: {
      handler: function (newValue) {
        if (Object.keys(this.existing).length > 0 && !this.checkLists(this.existing.tables, newValue)) {
          this.$emit("hasChanges", true);
        } else if (Object.keys(this.existing).length == 0 && newValue.length > 0) this.$emit("hasChanges", true);
      },
      deep: true,
    },
    innerRows: {
      handler: function (newValue) {
        if (Object.keys(this.existing).length > 0 && !this.checkLists(this.existing.rows, newValue)) {
          this.$emit("hasChanges", true);
        } else if (Object.keys(this.existing).length == 0 && newValue.length > 0) this.$emit("hasChanges", true);
      },
      deep: true,
    },
    innerColumns: {
      handler: function (newValue) {
        if (Object.keys(this.existing).length > 0 && !this.checkLists(this.existing.columns, newValue)) {
          this.$emit("hasChanges", true);
        } else if (Object.keys(this.existing).length == 0 && newValue.length > 0) this.$emit("hasChanges", true);
      },
      deep: true,
    },
    innerValueFilter: {
      handler: function (newValue) {
        if (Object.keys(this.existing).length > 0 && !this.checkDicts(this.existing.filters, newValue)) {
          this.$emit("hasChanges", true);
        } else if (Object.keys(this.existing).length == 0 && newValue.length > 0) this.$emit("hasChanges", true);
      },
      deep: true,
    },
  },
  mounted() {
    var self = this;
    $(document).on("click", function (event) {
      if (
        $(".pvtAttr") !== event.target &&
        !$(".pvtAttr").has(event.target).length
      ) {
        self.currentOpen = "";
      }
    });

    // Default value filter
    this.propsData.valueFilter = this.defaultValueFilter;
    this.propsData.vals = this.defaultVals;
  },
  methods: {
    init() {
      this.materializeInput(this.data);
      this.propsData.vals = this.vals.slice();
      this.propsData.rows = this.rows;
      this.propsData.cols = this.cols;
      this.propsData.table = [];
      this.unusedOrder = this.unusedAttrs;
      Object.keys(this.attrValues).map(this.assignValue);
    },
    checkLists(oldList, newList) {
      var same = true;
      oldList.map((x) => {
        if (!newList.includes(x)) {
          same = false;
        }
      })
      newList.map((x) => {
        if (!oldList.includes(x)) {
          same = false;
        }
      })
      return same;
    },
    checkDicts(oldDict, newDict) {
      var same = true;
      Object.keys(oldDict).map((x) => {
        Object.keys(oldDict[x]).map((y) => {
          if (!Object.keys(newDict[x]).includes(y)) {
            same = false
          }
        })
      })
      Object.keys(newDict).map((x) => {
        Object.keys(newDict[x]).map((y) => {
          if (!Object.keys(oldDict[x]).includes(y)) {
            same = false
          }
        })
      })
      return same;
    },
    checkDict(val) {
      var empty = true;
      Object.keys(val).map((x) => {
        if (Object.keys(val[x]).length > 0) {
          empty = false;
        }
      });
      return empty;
    },
    getDetails(props, aggregatorName, vals) {
      var details = {
        templateName: "",
        isPublic: true,
        aggreatorName: aggregatorName,
        values: vals,
        tables: this.unusedAttrs,
        rows: this.rowAttrs,
        columns: this.colAttrs,
        filters: props.valueFilter,
      };
      return details;
    },
    setDetails(details) {
      return {
        id: details.id,
        templateName: details.name,
        isPublic: details.type == "Team" ? true : false,
        aggreatorName: details.aggreatorName,
        values: details.vals,
        tables: details.table,
        rows: details.row,
        columns: details.column,
        filters: details.filter
      };
    },
    assignValue(field) {
      this.$set(this.propsData.valueFilter, field, {});
    },
    propUpdater(key) {
      return (value) => {
        this.propsData[key] = value;
      };
    },
    updateValueFilter({ attribute, valueFilter }) {
      this.$set(this.propsData.valueFilter, attribute, valueFilter);
    },
    moveFilterBoxToTop({ attribute }) {
      this.maxZIndex += 1;
      this.zIndices[attribute] = this.maxZIndex + 1;
    },
    openFilterBox({ attribute, open }) {
      this.currentOpen = open ? attribute : "";
    },
    materializeInput(nextData) {
      if (this.propsData.data === nextData) {
        return;
      }
      this.propsData.data = nextData;
      const attrValues = {};
      const materializedInput = [];
      let recordsProcessed = 0;
      PivotData.forEachRecord(this.data, this.derivedAttributes, function (
        record
      ) {
        materializedInput.push(record);
        for (const attr of Object.keys(record)) {
          if (!(attr in attrValues)) {
            attrValues[attr] = {};
            if (recordsProcessed > 0) {
              attrValues[attr].null = recordsProcessed;
            }
          }
        }
        for (const attr in attrValues) {
          const value = attr in record ? record[attr] : "null";
          if (!(value in attrValues[attr])) {
            attrValues[attr][value] = 0;
          }
          attrValues[attr][value]++;
        }
        recordsProcessed++;
      });
      this.materializedInput = materializedInput;
      this.attrValues = attrValues;
    },
    makeDnDCell(items, onChange, classes, h, text = "") {
      var arr = [
        h(
          "span",
          {
            staticClass: "pvtEmpty",
          },
          text
        ),
      ];
      if (items.length > 0) {
        arr = [
          items.map((x) => {
            return h(DraggableAttribute, {
              props: {
                sortable:
                  this.sortonlyFromDragDrop.includes(x) ||
                  !this.disabledFromDragDrop.includes(x),
                draggable:
                  !this.sortonlyFromDragDrop.includes(x) &&
                  !this.disabledFromDragDrop.includes(x),
                name: x,
                key: x,
                attrValues: this.attrValues[x],
                sorter: getSort(this.sorters, x),
                menuLimit: this.menuLimit,
                zIndex: this.zIndices[x] || this.maxZIndex,
                valueFilter: this.propsData.valueFilter[x],
                open: this.currentOpen == x,
              },
              domProps: {},
              on: {
                "update:filter": this.updateValueFilter,
                "moveToTop:filterbox": this.moveFilterBoxToTop,
                "open:filterbox": this.openFilterBox,
              },
            });
          }),
        ];
      }
      return h(
        draggable,
        {
          attrs: {
            draggable: "li[data-id]",
            group: "sharted",
            ghostClass: ".pvtPlaceholder",
            filter: ".pvtFilterBox",
            preventOnFilter: false,
            tag: "td",
          },
          props: {
            value: items,
          },
          staticClass: classes,
          on: {
            sort: onChange.bind(this),
          },
        },
        arr
      );
    },
    rendererCell(rendererName, h) {
      return this.$slots.rendererCell
        ? h(
          "td",
          {
            staticClass: ["pvtRenderers pvtVals pvtText"],
          },
          this.$slots.rendererCell
        )
        : h(
          "td",
          {
            staticClass: ["pvtRenderers"],
          },
          [
            h(Object.keys(this.renderers).length > 1 ? Dropdown : Single, {
              props: {
                values: Object.keys(this.renderers),
              },
              domProps: {
                value: rendererName,
              },
              on: {
                input: (value) => {
                  this.propUpdater("rendererName")(value);
                  this.propUpdater("renderer", this.renderers[value]);
                },
              },
            }),
          ]
        );
    },
    aggregatorCell(aggregatorName, vals, h) {
      return this.$slots.aggregatorCell
        ? h(
          "td",
          {
            staticClass: ["pvtVals pvtText"],
          },
          this.$slots.aggregatorCell
        )
        : h(
          "td",
          {
            staticClass: ["pvtVals"],
          },
          [
            h("div", [
              h(Dropdown, {
                style: {
                  display: "inline-block",
                },
                props: {
                  values: Object.keys(this.customAggregators),
                },
                domProps: {
                  value: aggregatorName,
                },
                on: {
                  input: (value) => {
                    this.propUpdater("aggregatorName")(value);
                  },
                },
              }),
              h(
                "a",
                {
                  staticClass: ["pvtRowOrder"],
                  attrs: {
                    role: "button",
                  },
                  on: {
                    click: () => {
                      this.propUpdater("rowOrder")(
                        this.sortIcons[this.propsData.rowOrder].next
                      );
                    },
                  },
                },
                this.sortIcons[this.propsData.rowOrder].rowSymbol
              ),
              h(
                "a",
                {
                  staticClass: ["pvtColOrder"],
                  attrs: {
                    role: "button",
                  },
                  on: {
                    click: () => {
                      this.propUpdater("colOrder")(
                        this.sortIcons[this.propsData.colOrder].next
                      );
                    },
                  },
                },
                this.sortIcons[this.propsData.colOrder].colSymbol
              ),
            ]),
            this.numValsAllowed > 0
              ? new Array(this.numValsAllowed).fill().map((n, i) => [
                h(Dropdown, {
                  props: {
                    values: Object.keys(this.attrValues).filter(
                      (e) =>
                        !this.hiddenAttributes.includes(e) &&
                        !this.hiddenFromAggregators.includes(e)
                    ),
                  },
                  domProps: {
                    value: vals[i],
                  },
                  on: {
                    input: (value) => {
                      this.propsData.vals.splice(i, 1, value);
                    },
                  },
                }),
              ])
              : undefined,
          ]
        );
    },
    outputCell(props, isPlotlyRenderer, h) {
      return h(
        "td",
        {
          staticClass: ["pvtOutput"],
        },
        [
          h("div", { staticClass: ["innertable"] }, [
            isPlotlyRenderer
              ? h(PlotlyRenderer[props.rendererName], {
                props,
              })
              : h(Pivottable, {
                props: {
                  ...props,
                  tableMaxWidth: this.tableMaxWidth,
                },
              }),
          ]),
        ]
      );
    },
  },
  render(h) {
    if (this.data.length < 1) return;
    const rendererName = this.propsData.rendererName || this.rendererName;
    const aggregatorName =
      this.propsData.aggregatorName != ""
        ? this.propsData.aggregatorName
        : this.defaultAggregatorName;
    const vals = this.innerVals;
    const unusedAttrsCell = this.makeDnDCell(
      this.unusedAttrs,
      (e) => {
        const item = e.item.getAttribute("data-id");
        if (
          this.sortonlyFromDragDrop.includes(item) &&
          (!e.from.classList.contains("pvtUnused") ||
            !e.to.classList.contains("pvtUnused"))
        ) {
          return;
        }
        if (e.from.classList.contains("pvtUnused")) {
          this.propsData.table.splice(e.oldIndex, 1);
        }
        if (e.to.classList.contains("pvtUnused")) {
          this.propsData.table.splice(e.newIndex, 0, item);
        }
      },
      `pvtAxisContainer pvtUnused pvtHorizList`,
      h
    );
    const colAttrsCell = this.makeDnDCell(
      this.colAttrs,
      (e) => {
        const item = e.item.getAttribute("data-id");
        if (
          this.sortonlyFromDragDrop.includes(item) &&
          (!e.from.classList.contains("pvtCols") ||
            !e.to.classList.contains("pvtCols"))
        ) {
          return;
        }
        if (e.from.classList.contains("pvtCols")) {
          this.propsData.cols.splice(e.oldIndex, 1);
        }
        if (e.to.classList.contains("pvtCols")) {
          this.propsData.cols.splice(e.newIndex, 0, item);
        }
      },
      "pvtAxisContainer pvtHorizList pvtCols",
      h,
      "Select Columns from Table"
    );
    const rowAttrsCell = this.makeDnDCell(
      this.rowAttrs,
      (e) => {
        const item = e.item.getAttribute("data-id");
        if (
          this.sortonlyFromDragDrop.includes(item) &&
          (!e.from.classList.contains("pvtRows") ||
            !e.to.classList.contains("pvtRows"))
        ) {
          return;
        }
        if (e.from.classList.contains("pvtRows")) {
          this.propsData.rows.splice(e.oldIndex, 1);
        }
        if (e.to.classList.contains("pvtRows")) {
          this.propsData.rows.splice(e.newIndex, 0, item);
        }
      },
      "pvtAxisContainer pvtVertList pvtRows",
      h,
      "Select Rows from Table"
    );
    const props = {
      ...this.$props,
      data: this.materializedInput,
      rowOrder: this.propsData.rowOrder,
      colOrder: this.propsData.colOrder,
      valueFilter: this.propsData.valueFilter,
      rows: this.propsData.rows,
      cols: this.propsData.cols,
      table: this.propsData.table,
      rendererName,
      aggregatorName,
      vals,
    };
    const rendererCell = this.rendererCell(rendererName, h);
    const aggregatorCell = this.aggregatorCell(aggregatorName, vals, h);
    const outputCell = this.outputCell(
      props,
      rendererName.indexOf("Chart") > -1,
      h
    );

    return h(
      "div",
      {
        staticClass: ["wrapper"],
      },
      [
        h(Header, {
          props: {
            values: this.fields,
            defaultTables: this.defaultTables,
            defaultRows: this.defaultRows,
            defaultColumns: this.defaultColumns,
            attrs: [
              { text: "Row", fields: this.rowAttrs },
              { text: "Column", fields: this.colAttrs },
              { text: "Table", fields: this.unusedAttrs },
            ],
            templates: this.showTemplates,
            roleCreate: this.roleCreate,
            roleEditDelete: this.roleEditDelete,
            clear: this.clear,
            existing: this.existing
          },
          on: {
            input: (value) => {
              this.propsData.rows = value[0].fields;
              this.propsData.cols = value[1].fields;
              this.propsData.table = value[2].fields;
            },
            reset: () => {
              //remove filters
              this.propsData.aggregatorName = this.defaultAggregatorName;
              this.propsData.vals = [];
              this.existing = {};
              Object.keys(this.attrValues).map(this.assignValue);
              this.$emit("hasChanges", false)
            },
            selectTemp: (details) => {
              this.propsData.rows = details.row;
              this.propsData.cols = details.column;
              this.propsData.table = details.table;
              this.propsData.aggregatorName = details.aggreatorName;
              this.propsData.vals = [...details.vals];
              this.propsData.valueFilter = details.filter;
              this.existing = this.setDetails(details);
              this.$emit("hasChanges", false)
            },
            deleteTemp: (details, tempselected) => {
              if (Object.keys(tempselected).length > 0) this.existing = tempselected;
              this.$emit("showDeleteModal", details, tempselected);
            },
          },
        }),
        h("div", { staticClass: "tableWrapper" }, [
          h(
            "table",
            {
              staticClass: ["pvtUi"],
            },
            [
              h("tbody", [
                h("tr", [rendererCell, unusedAttrsCell]),
                h("tr", [aggregatorCell, colAttrsCell]),
                h("tr", [rowAttrsCell, outputCell]),
              ]),
            ]
          ),
          h(SaveBtn, {
            on: {
              create: () => {
                this.$emit(
                  "showCreateModal",
                  this.getDetails(props, aggregatorName, vals),
                  this.existing
                );
              },
            },
          }),
        ]),
      ]
    );
  },
};
