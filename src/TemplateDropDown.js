
export default {
  props: ["templates", "optionSelected", "roleCreate", "roleEditDelete"],
  watch: {
    templates() {
      this.init();
    },
    optionSelected() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  data() {
    return {
      templateList: [
        { type: "Team", list: [] },
        { type: "Personal", list: [] },
      ],
      templateSelected: "Team",
    };
  },
  methods: {
    init() {
      this.templateList = [
        { type: "Team", list: [] },
        { type: "Personal", list: [] },
      ];

      this.templates.map((x) => {
        var template = {
          id: x.id,
          name: x.templateName,
          type: x.isPublic ? "Team" : "Personal",
          aggreatorName: x.aggreatorName,
          vals: JSON.parse(x.values),
          table: JSON.parse(x.tables),
          row: JSON.parse(x.rows),
          column: JSON.parse(x.columns),
          filter: JSON.parse(x.filters),
          selected: false
        }

        if (Object.keys(this.optionSelected).length > 0) {
          template.selected = (this.optionSelected.isPublic ? "Team" : "Personal") == template.type && this.optionSelected.templateName == template.name;
          this.templateList.filter((item) => item.type == template.type)
          [0].list.push(template)
        } else {
          this.templateList.filter((item) => item.type == template.type)
          [0].list.push(template)
        }
      })
    },
    switchTabs(evt, type) {
      var tabLinks;
      tabLinks = document.getElementsByClassName("pvtTabBtn");
      for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
      }
      evt.currentTarget.className += " active";
      this.templateSelected = type;
    },
    selectValue(details) {
      this.templateList.map((y) => {
        y.list.map((x) => {
          x.selected = false;
          if (x.name == details.name && x.type == this.templateSelected) {
            x.selected = true;
          }
        })
      })
      this.$emit("selectTemp", details)
    }
  },
  render(h) {
    return h(
      "span",
      {
        staticClass: ["OuterTemplate"],
      },
      [
        //Drop Down List (with sample option)
        h(
          "span",
          {
            staticClass: ["OuterTemplateDropDown"],
          },
          [

            h(
              "span",
              {
                staticClass: ["templateName"]
              },
              Object.keys(this.optionSelected).length > 0 ?
                this.optionSelected.templateName :
                "Select Templates"),
            h(
              "span",
              {
                staticClass: ["OuterTriangle"],
              },
              "  ▾"
            ),


          ]
        ),
        h(
          //Actual Options
          "div",
          {
            staticClass: ["OuterTemplateFilterBox"],
          },
          [
            h(
              "div",
              {
                staticClass: ["pvtTabHeader"],
              },
              [
                this.templateList.map((x) => {
                  return h(
                    "button",
                    {
                      staticClass:
                        x.type == this.templateSelected
                          ? ["pvtTabBtn active"]
                          : ["pvtTabBtn"],
                      on: {
                        click: (e) => this.switchTabs(e, x.type),
                      },
                    },
                    x.type
                  );
                }),
              ]
            ),
            h(
              "div",
              {
                staticClass: ["pvtCheckContainer"],
              },
              [
                this.templateList
                  .filter((y) => y.type == this.templateSelected)[0].list.length == 0 ?
                  h(
                    "p",
                    {
                      staticClass: ["emptyState"]
                    },
                    this.templateSelected == "Team" ?
                      this.roleCreate ?
                        "Drag and Drop the fields, click on 'Save Template' to create your template." :
                        "Only Administrators are allowed to create team templates" :
                      "Drag and Drop the fields, click on 'Save Template' to create your template."
                  ) :
                  this.templateList
                    .filter((y) => y.type == this.templateSelected)[0]
                    .list.map((x) => {
                      return h(
                        "p",
                        {
                          staticClass: ["templateOption"],
                          class: {
                            selected: x.selected
                          },
                          attrs: {
                            key: x.name,
                          },

                        },
                        [
                          h(
                            "span",
                            {
                              staticClass: ["optionName"],
                              on: {
                                click: () => this.selectValue(x),
                              },
                            },
                            x.name
                          ),
                          (this.roleEditDelete && this.templateSelected == "Team") || (this.templateSelected == "Personal") ?
                            h("span",
                              {
                                staticClass: ["tooltip-wrapper"],
                              }, [
                              h(
                                "img",
                                {
                                  staticClass: ["deleteIcon"],
                                  attrs: {
                                    src: require(`@/assets/icon/bin.png`)
                                  },
                                  on: {
                                    click: () => {
                                      this.$emit("delete", x)
                                    },
                                  }
                                }
                              ),
                            ])
                            :
                            undefined,

                        ]
                      );
                    }),
                h(
                  "span",
                  {
                    staticClass: ["tooltiptext"]
                  },
                  "Delete"
                )
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
                  "Templates found: " + this.templateList
                    .filter((y) => y.type == this.templateSelected)[0].list.length
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
};
