import ExportBtn from "./ExportBtn";
import TemplateDropDown from "./TemplateDropDown";
import MultiDropDown from "./MultiDropDown";
import $ from "jquery";

export default {
  props: ["values", "defaultTables", "defaultRows", "defaultColumns", "attrs", "templates", "role", "approved"],
  created() {
    $(document).off("click");
    $(document).on("click", function(event) {
      if (
        $(".OuterTemplateDropDown").has(event.target).length && fieldexpanded) {
        hidefield(event);
        showSelections();
      } else if ($(".OuterDropDown").has(event.target).length && tempexpanded) {
        hidetemp(event);
        showCheckboxes();
      } else if (!$(".OuterTemplate").has(event.target).length 
        && !$(".Outer").has(event.target).length) {
        hidefield(event);
        hidetemp(event);
      } else if ($(".OuterDropDown").has(event.target).length) {
        showCheckboxes();
      } else if ($(".OuterTemplateDropDown").has(event.target).length) {
        showSelections();
      }
    });
    this.init();
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
      if (type === "Table") return this.defaultTables.indexOf(val) !== -1;
      else if (type === "Column")
        return this.defaultColumns.indexOf(val) !== -1;
      else if (type === "Row") return this.defaultRows.indexOf(val) !== -1;
      else return false;
    },
    selectedOrNotOthers(type, val) {
      if (type === "Table")
        return (
          this.defaultColumns.indexOf(val) !== -1 ||
          this.defaultRows.indexOf(val) !== -1
        );
      else if (type === "Column")
        return (
          this.defaultTables.indexOf(val) !== -1 ||
          this.defaultRows.indexOf(val) !== -1
        );
      else if (type === "Row")
        return (
          this.defaultTables.indexOf(val) !== -1 ||
          this.defaultColumns.indexOf(val) !== -1
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
      this.$emit("input", list);
    },
    clearFields() {
      this.init(true);
      this.$emit("clear");
    },
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
            role: this.role,
            approved: this.approved
          },
          on: {
            selectTemp: (details, existing) => {
              this.TempoptionSelected = existing;
              this.$emit("selectTemp", details, existing)
            },
            delete: (details) => {
              if (details.name == this.TempoptionSelected[1] && details.type == this.TempoptionSelected[0]) {
                this.TempoptionSelected = [];
                this.clearFields();
              }
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
            },
          },
        }),
        h(
          //Generate Button
          "button",
          {
            staticClass: ["greenBtn exportBtn"],
            attrs: {
              role: "button",
            },
            on: {
              click: () => this.generateReport(),
            },
          },
          "Populate"
        ),
        h(
          //Clear Fields Button
          "button",
          {
            staticClass: ["clearbtn"],
            attrs: {
              role: "button",
            },
            on: {
              click: () => this.clearFields(),
            },
          },
          "Clear"
        ),
        h(ExportBtn),
      ]
    );
  },
  data() {
    return {
      options: null,
      optionSelected: "Table",
      TempoptionSelected: []
    };
  },
};

var fieldexpanded = false;
var tempexpanded = false;

function showCheckboxes() {
  if (!fieldexpanded) {
    $(".OuterFilterBox").show();
    fieldexpanded = true;
  } else {
    $(".OuterFilterBox").hide();
    fieldexpanded = false;
  }
}

function showSelections() {
  if (!tempexpanded) {
    $(".OuterTemplateFilterBox").show();
    tempexpanded = true;
  } else {
    $(".OuterTemplateFilterBox").hide();
    tempexpanded = false;
  }
}

function hidefield(event) {
  $(".OuterFilterBox").hide();
  fieldexpanded = false;
}

function hidetemp(event) {
  $(".OuterTemplateFilterBox").hide();
  tempexpanded = false;
}
