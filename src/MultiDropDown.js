import JQuery from "jquery";

export default {
  props: ["values"],
  mounted() {
    JQuery(document).on("click", ".OuterDropDown", function() {
      showCheckboxes();
    });
    for (var index in this.values) {
      this.selected.push({
        value: this.values[index], 
        selected: true
      });
    }
  },
  methods: {
    toggleValue(value) {
       this.selected.map((x) => {
       if (value === x.value) {
         x.selected = !x.selected
       }
      })
    },
    selectAll() {
      this.selected.map((x) => {
          x.selected = true
      })
    },
    deselectAll() {
      this.selected.map((x) => {
        x.selected = false
    })
    },
    GenerateReport() {
      var hidden = []
      this.selected.map((x) => {
        if (x.selected == false) {
          hidden.push(x.value)
        }
      })
      this.$emit("input", hidden);
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  render(h) {
    return h(
      "div",
      {
        staticClass: ["OuterBox"],
      },
      [
        h(
          //Drop Down List (with sample option)
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
                "Select Column Fields",
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
              "a",
              {
                staticClass: ["pvtButton"],
                attrs: {
                  role: "button",
                },
                on: {
                  click: () => this.selectAll(),
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
                  click: () => this.deselectAll(),
                },
              },
              `Deselect All`
            ),
            this.selected.map((x) => {
              const checked = x.selected;
              return h(
                "p",
                {
                  class: {
                    selected: checked,
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
                      checked: checked,
                    },
                  }),
                  x.value,
                ]
              );
            }),
          ]
        ),
        h(
          "button",
          {
            staticClass: ["generatebtn"],
            attrs: {
              role: "button",
            },
            on: {
              click: () => this.GenerateReport(),
            },
          },
          "Generate"
        ),
      ]
    );
  },
};

var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementsByClassName("OuterFilterBox")[0];

  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}
