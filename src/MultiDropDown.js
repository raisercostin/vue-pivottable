export default {
  props: [
    "values",
    "defaultTables",
    "defaultRows",
    "defaultColumns",
    "attrs",
    "optionList",
    "selectedOption",
  ],
  created() {
    this.options = this.optionList;
    this.optionSelected = this.selectedOption;
  },
  watch: {
    selectedOption() {
      this.optionSelected = this.selectedOption;
    },
    optionList() {
      this.options = this.optionList;
    },
    attrs() {
      var list = this.attrs;
      var current = this.options;

      if (
        list[0].fields.length > 0 ||
        list[1].fields.length > 0 ||
        list[2].fields.length > 0
      ) {
        //map each each field in list
        Object.keys(list).map((option) => {
          list[option].fields.map((listitem) => {
            //check if listitem is not selected in options
            var boolitem = current[option].fields.filter(
              (field) => field.value == listitem && !field.selected
            );
            var bool = boolitem.length > 0;
            if (bool) {
              //check if it was selected b4
              if (boolitem[0].selectedOther) {
                Object.keys(current)
                  .filter((x) => current[x].text != list[option].text)
                  .map((item) => {
                    var bool2 =
                      current[item].fields.filter(
                        (y) => y.value == listitem && y.selected
                      ).length > 0;
                    if (bool2) {
                      //if true then we toggle the checkboxes for the other option that is selected
                      this.toggleOption(current[item].text);
                      this.toggleValue(listitem);
                    }
                  });
              }
              //if true then we toggle the checkboxes
              this.toggleOption(current[option].text);
              this.toggleValue(listitem);
            }
          });
        });
      }
    },
  },
  computed: {
    filtered() {
      let list = this.options.filter((y) => y.text == this.optionSelected)[0];
      if (this.filterText != "") {
        var fields = list.fields.filter((x) => {
          return x.value
            .toLowerCase()
            .trim()
            .includes(this.filterText.toLowerCase().trim());
        });
        return fields;
      }

      return list.fields;
    },
  },
  methods: {
    toggleValue(value) {
      //update current option filter
      this.options
        .filter((x) => x.text == this.optionSelected)[0]
        .fields.map((x) => {
          if (value === x.value && x.selectedOther == false) {
            x.selected = !x.selected;

            //update other option filter
            this.options
              .filter((j) => j.text != this.optionSelected)
              .map((option) => {
                option.fields.map((j) => {
                  if (j.value == value) j.selectedOther = !j.selectedOther;
                });
              });
          }
        });
      this.$emit("fieldsChange", this.options);
    },
    toggleOption(value) {
      this.optionSelected = value;
      this.$emit("optionChange", this.optionSelected);
    },
    selectHelper(type) {
      var marked = [];
      this.options
        .filter((x) => x.text == this.optionSelected)[0]
        .fields.filter((x) => x.selected == !type && x.selectedOther)
        .map((x) => {
          marked.push(x.value);
          x.selected = type;
        });

      this.options
        .filter((x) => x.text != this.optionSelected)
        .map((option) => {
          option.fields
            .filter((x) =>
              type ? x.selected == !type : x.selectedOther == !type
            )
            .map((x) => {
              if (marked.includes(x.value)) x.selectedOther = type;
            });
        });
    },
    selectAll(filter = false) {
      var marked = [];
      this.options
        .filter((x) => x.text == this.optionSelected)[0]
        .fields.filter((x) => x.selected == false && !x.selectedOther)
        .map((x) => {
          if (filter) {
            var bool =
              this.filtered.filter((y) => x.value == y.value).length > 0;
            if (bool) {
              marked.push(x.value);
              x.selected = true;
            }
          } else {
            marked.push(x.value);
            x.selected = true;
          }
        });

      this.options
        .filter((x) => x.text != this.optionSelected)
        .map((option) => {
          option.fields
            .filter((x) => x.selected == false)
            .map((x) => {
              if (marked.includes(x.value)) x.selectedOther = true;
            });
        });
        this.$emit("fieldsChange", this.options);
    },
    deselectAll(filter = false) {
      var marked = [];
      this.options
        .filter((x) => x.text == this.optionSelected)[0]
        .fields.filter((x) => x.selected == true && !x.selectedOther)
        .map((x) => {
          if (filter) {
            var bool =
              this.filtered.filter((y) => x.value == y.value).length > 0;
            if (bool) {
              marked.push(x.value);
              x.selected = false;
            }
          } else {
            marked.push(x.value);
            x.selected = false;
          }
        });

      this.options
        .filter((x) => x.text != this.optionSelected)
        .map((option) => {
          option.fields
            .filter((x) => x.selectedOther == true)
            .map((x) => {
              if (marked.includes(x.value)) x.selectedOther = false;
            });
        });
        this.$emit("fieldsChange", this.options);
    },
  },
  data() {
    return {
      options: null,
      optionSelected: "",
      filterText: "",
    };
  },
  render(h) {
    return h(
      "span",
      {
        staticClass: ["Outer"],
      },
      [
        //Drop Down List (with sample option)
        h(
          "span",
          {
            staticClass: ["OuterDropDown"],
          },
          [
            h(
              "span",
              {
                attrs: {
                  value: "Sample option",
                },
              },
              [
                h(
                  "span",
                  {
                    staticClass: ["templateName"]
                  },
                "Select Fields"),
                h(
                  "span",
                  {
                    staticClass: ["OuterTriangle"],
                  },
                  "  ▾"
                ),
              ]
            ),
          ]
        ),
        h(
          //Actual Options
          "div",
          {
            staticClass: ["OuterFilterBox"],
          },
          [
            h(
              "div",
              {
                staticClass: ["pvtFilterSearchContainer"],
              },
              [
                h("input", {
                  staticClass: ["pvtFilterSearch"],
                  attrs: {
                    type: "search",
                    placeholder: "Filter Values",
                  },
                  domProps: {
                    value: this.filterText,
                  },
                  on: {
                    input: (e) => {
                      this.filterText = e.target.value;
                    },
                  },
                }),
              ]
            ),
            h(
              "div",
              {
                staticClass: ["pvtOptionsContainer"],
              },
              [
                h(
                  "a",
                  {
                    staticClass: ["pvtButton"],
                    attrs: {
                      role: "button",
                    },
                    on: {
                      click: () =>
                        this.filterText == ""
                          ? this.selectAll()
                          : this.selectAll(true),
                    },
                  },
                  `Select All`
                ),
                h(
                  "a",
                  {
                    staticClass: ["pvtButton"],
                    attrs: {
                      role: "button",
                    },
                    on: {
                      click: () =>
                        this.filterText == ""
                          ? this.deselectAll()
                          : this.deselectAll(true),
                    },
                  },
                  `Deselect All`
                ),

                h(
                  "div",
                  {
                    staticClass: ["pvtOptions"],
                  },
                  [
                    this.options.map((x) => {
                      const checked = this.optionSelected == x.text;
                      return h(
                        "label",
                        {
                          class: {
                            selected: checked,
                          },
                          attrs: {
                            key: x.value,
                          },
                          staticClass: ["pvtOption"],
                          on: {
                            click: () => this.toggleOption(x.text),
                          },
                        },
                        [
                          h("input", {
                            attrs: {
                              type: "radio",
                            },
                            domProps: {
                              checked: checked,
                            },
                          }),
                          x.text,
                        ]
                      );
                    }),
                  ]
                ),
              ]
            ),
            h(
              "p",
              {
                staticClass: ["remarkText"],
              },
              [
                h("span", "Selecting fields for "),
                h(
                  "span",
                  {
                    staticClass: ["optionText"],
                  },
                  this.optionSelected + "..."
                ),
                h(
                  "a",
                  {
                    staticClass: ["linkText"],
                    on: {
                      click: () => this.$emit("clear")
                    }
                  },
                  "Clear Filters"
                )
              ]
            ),
            h(
              "div",
              {
                staticClass: ["pvtCheckContainer"],
              },
              [
                this.filtered.map((x) => {
                  const checked = x.selected;
                  return h(
                    "p",
                    {
                      class: {
                        selected: x.selectedOther
                          ? x.selectedOther
                          : x.selected,
                        selectedOther: x.selectedOther,
                      },
                      attrs: {
                        key: x.value,
                      },
                      on: {
                        click: () => this.toggleValue(x.value),
                      },
                    },
                    [
                      h("input", {
                        attrs: {
                          type: "checkbox",
                        },
                        domProps: {
                          checked: x.selectedOther
                            ? x.selectedOther
                            : x.selected,
                          disabled: x.selectedOther,
                        },
                      }),
                      x.value,
                    ]
                  );
                }),
              ]
            ),
            h(
              "div",
              {
                staticClass: ["recordNumberContainer"],
              },
              [
                h(
                  "span",
                  {
                    staticClass: ["recordNumber"],
                  },
                  "Fields found: " + this.filtered.length
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
};
