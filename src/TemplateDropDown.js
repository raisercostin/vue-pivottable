export default {
  props: ["values"],
  created() {
    this.templates = [
      { type: "General", list: ["Template 1", "Template 3"] },
      { type: "Personal", list: ["Template 2"] },
    ];
  },
  data() {
    return {
      templates: [],
      templateSelected: "General",
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
                this.templates.map((x) => {
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
                this.templates
                  .filter((y) => y.type == this.templateSelected)[0]
                  .list.map((x) => {
                    return h(
                      "p",
                      {
                        staticClass: ["templateOption"],
                        attrs: {
                          key: x,
                        },
                        on: {
                          //click: () => this.toggleValue(x.value),
                        },
                      },
                      x
                    );
                  }),
              ]
            ),
          ]
        ),
      ]
    );
  },
};
