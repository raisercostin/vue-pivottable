export default {
  props: ["values"],
  created() {
    this.templates = ["Template 1", "Template 2"];
  },
  data() {
    return {
      templates: [],
      templateSelected: "",
    };
  },
  render(h) {
    return h("span", [
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
              staticClass: ["pvtCheckContainer"],
            },
            [
              this.templates.map((x) => {
                return h(
                  "p",
                  {
                    attrs: {
                      key: x.value,
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
    ]);
  },
};