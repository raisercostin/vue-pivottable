
export default {
  props: ["templates", "type"],
  watch: {
    templates() {
      this.templateList = [
        { type: "General", list: [] },
        { type: "Personal", list: [] },
      ];

      this.templates.map((x) => {
        
        var template = {
          name: x.templateName,
          type: x.isPublic ? "General" : "Personal",
          aggreatorName: x.aggreatorName,
          vals: JSON.parse(x.values),
          table: JSON.parse(x.tables),
          row: JSON.parse(x.rows), 
          column: JSON.parse(x.columns),
          filter: JSON.parse(x.filters),
          selected: false
        }
        template.selected = this.optionSelected[0] == template.type && this.optionSelected[1] == template.name;
        this.templateList.filter((item) => item.type == template.type)
        [0].list.push(template)
      })
    }
  },
  computed: {
    selected() {
      return this.optionSelected
    }
  }, 
  created() {
    console.log(this.templates)
    this.templates.map((x) => {
      var template = {
        id: x.id,
        name: x.templateName,
        type: x.isPublic ? "General" : "Personal",
        aggreatorName: x.aggreatorName,
        vals: JSON.parse(x.values),
        table: JSON.parse(x.tables),
        row: JSON.parse(x.rows), 
        column: JSON.parse(x.columns),
        filter: JSON.parse(x.filters),
        selected: false
      }
      this.templateList.filter((item) => item.type == template.type)
      [0].list.push(template)
    })
    
   
  },
  data() {
    return {
      templateList: [
        { type: "General", list: [] },
        { type: "Personal", list: [] },
      ],
      templateSelected: "General",
      optionSelected: []
    };
  },
  methods: {
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
      this.optionSelected[0] = this.templateSelected;
      this.optionSelected[1] = details.name;
      this.optionSelected[2] = details.id;
    
      this.templateList.map((y) => {
        y.list.map((x) => {
          x.selected = false;
      if (x.name == details.name && x.type == this.templateSelected) {
        x.selected = true;
      }
    })
      })                
      this.$emit("selectTemp", details, this.optionSelected)
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
                attrs: {
                  value: "Sample option",
                },
              },
              [
                "Select Templates",
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
                        h(
                          "img",
                          {
                            staticClass: ["deleteIcon"],
                            attrs: {
                              src: require(`@/assets/bin.png`)
                            },
                            on: {
                              click: () => this.$emit("delete", x)
                            }
                          }
                        ) 
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
