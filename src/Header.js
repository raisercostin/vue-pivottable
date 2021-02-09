import ExportBtn from "./ExportBtn";
import TemplateDropDown from "./TemplateDropDown";
import MultiDropDown from "./MultiDropDown";
import $ from "jquery";

export default {
  props: ["values", "defaultTables", "defaultRows", "defaultColumns", "attrs", "templates", "roleCreate", "roleEditDelete", "clear", "existing"],
  created() {
    $(document).off("click");
    $(document).off("mouseover");
    $(document).on("click", function (event) {
      if (
        $(".OuterTemplateDropDown").has(event.target).length && fieldexpanded) {
        hidefield();
        showSelections();
      } else if ($(".OuterDropDown").has(event.target).length && tempexpanded) {
        hidetemp();
        showCheckboxes();
      } else if ($(".templateOption").has(event.target).length > 0) {
        hidetemp();
      } else if (!$(".OuterTemplate").has(event.target).length
        && !$(".Outer").has(event.target).length) {
        $(".OuterDropDown").css("background-color", "white");
        $(".OuterTemplateDropDown").css("background-color", "white");
        hidefield();
        hidetemp();
      } else if ($(".OuterDropDown").has(event.target).length) {
        showCheckboxes();
      } else if ($(".OuterTemplateDropDown").has(event.target).length) {
        showSelections();
      }
    });
    $(document).on("mouseover", function (event) {
      if ($(".tooltip-wrapper").has(event.target).length) {
        var y = event.target.offsetTop - $(".pvtCheckContainer").scrollTop();
        $(".tooltiptext")[0].style.top = (y - 8) + 'px';
        $(".tooltiptext")[0].style.visibility = "visible"
      } else {
        $(".tooltiptext")[0].style.visibility = "hidden"
      }
    })
    this.init(true);
  },
  beforeDestroy() {
    $(document).off("click");
    $(document).off("mouseover");
  },
  watch: {
    templates() {
      if (this.clear) {
        this.clearFields();
        this.TempoptionSelected = {};
      }
    },
    existing() {
      if (Object.keys(this.existing).length > 0) {
        this.TempoptionSelected = this.existing;
        this.init();
      }
    }
  },
  methods: {
    init(clear = false) {
      this.options = [
        { text: "Row", fields: [] },
        { text: "Column", fields: [] },
        { text: "Table", fields: [] },
      ];
      if (!clear) {
        this.options.map((x) => {
          for (var index in this.values) {
            x.fields.push({
              value: this.values[index],
              selected: this.selectedOrNot(x.text, this.values[index]),
              selectedOther: this.selectedOrNotOthers(
                x.text,
                this.values[index]
              ),
            });
          }
        });
      } else {
        this.options.map((x) => {
          for (var index in this.values) {
            x.fields.push({
              value: this.values[index],
              selected: false,
              selectedOther: false,
            });
          }
        });
      }
      this.optionSelected = "Table";
      this.generateReport();
    },

    selectedOrNot(type, val) {
      if (type === "Table") return this.TempoptionSelected.tables.indexOf(val) !== -1;
      else if (type === "Column")
        return this.TempoptionSelected.columns.indexOf(val) !== -1;
      else if (type === "Row") return this.TempoptionSelected.rows.indexOf(val) !== -1;
      else return false;
    },
    selectedOrNotOthers(type, val) {
      if (type === "Table")
        return (
          this.TempoptionSelected.columns.indexOf(val) !== -1 ||
          this.TempoptionSelected.rows.indexOf(val) !== -1
        );
      else if (type === "Column")
        return (
          this.TempoptionSelected.tables.indexOf(val) !== -1 ||
          this.TempoptionSelected.rows.indexOf(val) !== -1
        );
      else if (type === "Row")
        return (
          this.TempoptionSelected.tables.indexOf(val) !== -1 ||
          this.TempoptionSelected.columns.indexOf(val) !== -1
        );
      else return false;
    },
    generateReport() {
      var list = [];
      this.options.map((option) => {
        list.push({
          type: option.text,
          fields: option.fields
            .filter((item) => item.selected == true)
            .map((x) => x.value),
        });
      });

      list.map((o) => {
        if (o.type === 'Row') {
          o.fields = o.fields.map((object, i) => this.TempoptionSelected.rows[i]);
        } else if (o.type === 'Column') {
          o.fields = o.fields.map((object, i) => this.TempoptionSelected.columns[i]);
        }
      })
      this.$emit("input", list);
    },
    resetFields() {
      this.init(true);
      this.TempoptionSelected = {};
      this.$emit("reset");
    },
    clearFields() {
      this.init(true);
      this.$emit("reset");
    }
  },
  render(h) {
    return h(
      "div",
      {
        staticClass: ["OuterBox"],
      },
      [
        h(TemplateDropDown, {
          props: {
            templates: this.templates,
            optionSelected: this.TempoptionSelected,
            roleCreate: this.roleCreate,
            roleEditDelete: this.roleEditDelete,
          },
          on: {
            selectTemp: (details) => {
              this.TempoptionSelected = details;
              this.$emit("selectTemp", details)
            },
            delete: (details) => {
              // if (details.name == this.TempoptionSelected[1] && details.type == this.TempoptionSelected[0]) {
              //   this.TempoptionSelected = [];
              //   this.clearFields();
              // }
              this.$emit("deleteTemp", details, this.TempoptionSelected)
            }

          }
        }),
        h(MultiDropDown, {
          props: {
            values: this.values,
            defaultTables: this.defaultTables,
            defaultRows: this.defaultRows,
            defaultColumns: this.defaultColumns,
            attrs: this.attrs,
            optionList: this.options,
            selectedOption: this.optionSelected,
          },
          on: {
            optionChange: (val) => {
              this.optionSelected = val;
            },
            fieldsChange: (val) => {
              this.options = val;
              this.generateReport();
            },
            clear: () => {
              this.clearFields();
            }
          },
        }),
        // h(
        //   //Generate Button
        //   "button",
        //   {
        //     staticClass: ["greenBtn"],
        //     attrs: {
        //       role: "button",
        //     },
        //     on: {
        //       click: () => this.generateReport(),
        //     },
        //   },
        //   "Populate"
        // ),
        h(
          //Clear Fields Button
          "button",
          {
            staticClass: ["clearbtn"],
            attrs: {
              role: "button",
            },
            on: {
              click: () => this.resetFields(),
            },
          },
          "Reset"
        ),
        h(ExportBtn),
      ]
    );
  },
  data() {
    return {
      options: null,
      optionSelected: "Table",
      TempoptionSelected: {}
    };
  },
};

var fieldexpanded = false;
var tempexpanded = false;

function showCheckboxes() {
  if (!fieldexpanded) {
    $(".OuterDropDown").css("background-color", "#ddd");
    $(".OuterFilterBox").show();
    fieldexpanded = true;
  } else {
    $(".OuterDropDown").css("background-color", "white");
    $(".OuterFilterBox").hide();
    fieldexpanded = false;
  }
}

function showSelections() {
  if (!tempexpanded) {
    $(".OuterTemplateDropDown").css("background-color", "#ddd");
    $(".OuterTemplateFilterBox").show();
    tempexpanded = true;
  } else {
    $(".OuterTemplateDropDown").css("background-color", "white");
    $(".OuterTemplateFilterBox").hide();
    tempexpanded = false;
  }
}

function hidefield() {
  $(".OuterDropDown").css("background-color", "white");
  $(".OuterFilterBox").hide();
  fieldexpanded = false;
}

function hidetemp() {
  $(".OuterTemplateDropDown").css("background-color", "white");
  $(".OuterTemplateFilterBox").hide();
  tempexpanded = false;
}
