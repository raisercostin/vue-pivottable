export default {
  name: 'draggable-attribute',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    attrValues: {
      type: Object,
      required: true,
    },
    valueFilter: {
      type: Object,
      default: function () {
        return {};
      },
    },
    sorter: {
      type: Function,
      required: true,
    },
    menuLimit: Number,
    zIndex: Number,
  },
  data() {
    return {
      // open: false,
      filterText: '',
      attribute: '',
      values: [],
      filter: {},
    };
  },
  computed: {
    disabled() {
      return !this.sortable && !this.draggable;
    },
    sortonly() {
      return this.sortable && !this.draggable;
    },
  },
  methods: {
    setValuesInFilter(attribute, values) {
      const valueFilter = values.reduce((r, v) => {
        r[v] = true;
        return r;
      }, {});
      this.$emit('update:filter', { attribute, valueFilter });
    },
    addValuesToFilter(attribute, values) {
      const valueFilter = values.reduce(
        (r, v) => {
          r[v] = true;
          return r;
        },
        {
          ...this.valueFilter,
        }
      );
      this.$emit('update:filter', { attribute, valueFilter });
    },
    removeValuesFromFilter(attribute, values) {
      const valueFilter = values.reduce(
        (r, v) => {
          if (r[v]) {
            delete r[v];
          }
          return r;
        },
        {
          ...this.valueFilter,
        }
      );
      this.$emit('update:filter', { attribute, valueFilter });
    },
    moveFilterBoxToTop(attribute) {
      this.$emit('moveToTop:filterbox', { attribute });
    },
    toggleValue(value) {
      if (value in this.valueFilter) {
        this.removeValuesFromFilter(this.name, [value]);
      } else {
        this.addValuesToFilter(this.name, [value]);
      }
    },
    matchesFilter(x) {
      return x
        .toLowerCase()
        .trim()
        .includes(this.filterText.toLowerCase().trim());
    },
    selectOnly(e, value) {
      e.stopPropagation();
      this.value = value;
      this.setValuesInFilter(
        this.name,
        Object.keys(this.attrValues).filter((y) => y !== value)
      );
    },
    getFilterBox(h, attr) {
      var foundmonth = false;
      const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const showMenu = Object.keys(this.attrValues).length < this.menuLimit;
      const values = Object.keys(this.attrValues);
      var shown;

      var months = new Array(12);
      months['Jan'] = 1;
      months['Feb'] = 2;
      months['Mar'] = 3;
      months['Apr'] = 4;
      months['May'] = 5;
      months['Jun'] = 6;
      months['Jul'] = 7;
      months['Aug'] = 8;
      months['Sep'] = 9;
      months['Oct'] = 10;
      months['Nov'] = 11;
      months['Dec'] = 12;
      months['No value'] = 13;

      function sortMonth(a, b) {
        var m1 = a.substring(0, 3);
        var y1 = a.substring(4);
        var m2 = b.substring(0, 3);
        var y2 = b.substring(4);

        if (Number(y1) > Number(y2)) {
          return 1;
        } else if (Number(y1) < Number(y2)) {
          return -1;
        } else {
          if (months[m1] > months[m2]) {
            return 1;
          } 
          if (a.includes("No value" || b.includes("No value"))) {
            return -1
          }
          else if (months[m1] < months[m2]) {
            return -1;
          }
        }
        return 0;
      }

      for (var j = 0; j < values.length; j++) {
        for (var i = 0; i < monthArray.length; i++) {
          if (values[j] === monthArray[i]) {
            foundmonth = true;
            break;
          }
        }
      }
      if (foundmonth) { 
        shown = values.filter(this.matchesFilter.bind(this)).sort(sortMonth);
      }
      else { 
        shown = values.filter(this.matchesFilter.bind(this)).sort(function (a, b) {
          if (isNaN(a) && isNaN(b)) return a < b ? -1 : a == b ? 0 : 1;//both are string
          else if (isNaN(a)) return 1;//only a is a string
          else if (isNaN(b)) return -1;//only b is a string
          else return b - a;//both are num

        })
      }
      return h(
        'div',
        {
          staticClass: ['pvtFilterBox'],
          style: {
            display: 'block',
            cursor: 'initial',
            zIndex: this.zIndex,
          },
          on: {
            click: () => this.moveFilterBoxToTop(this.name),
          },
        },
        [
          h(
            'div',
            {
              staticClass: 'pvtSearchContainer',
            },
            [
              showMenu || h('p', 'too many values to show'),
              showMenu &&
              h('input', {
                staticClass: ['pvtSearch'],
                attrs: {
                  type: 'search',
                  placeholder: 'Filter Values',
                },
                domProps: {
                  value: this.filterText,
                },
                on: {
                  input: (e) => {
                    this.filterText = e.target.value;
                    this.$emit('input', e.target.value);
                  },
                },
              }),
              h('a', {
                staticClass: ['pvtFilterTextClear'],
                on: {
                  click: () => {
                    this.filterText = '';
                  },
                },
              }),
              h(
                'a',
                {
                  staticClass: ['pvtButton'],
                  attrs: {
                    role: 'button',
                  },
                  on: {
                    click: () => this.removeValuesFromFilter(this.name, Object.keys(this.attrValues).filter(this.matchesFilter.bind(this))),
                  },
                },
                `Select ${values.length === shown.length ? 'All' : shown.length}`
              ),
              h(
                'a',
                {
                  staticClass: ['pvtButton'],
                  attrs: {
                    role: 'button',
                  },
                  on: {
                    click: () => this.addValuesToFilter(this.name, Object.keys(this.attrValues).filter(this.matchesFilter.bind(this))),
                  },
                },
                `Deselect ${values.length === shown.length ? 'All' : shown.length}`
              ),
            ]
          ),
          showMenu &&
          h(
            'div',
            {
              staticClass: ['pvtCheckContainer'],
            },
            [
              ...shown.map((x) => {
                const checked = !(x in this.valueFilter);
                return h(
                  'p',
                  {
                    class: {
                      selected: checked,
                    },
                    attrs: {
                      key: x,
                    },
                    on: {
                      click: () => this.toggleValue(x),
                    },
                  },
                  [
                    h('input', {
                      attrs: {
                        type: 'checkbox',
                      },
                      domProps: {
                        checked: checked,
                      },
                    }),
                    x,
                    h(
                      'a',
                      {
                        staticClass: ['pvtOnly'],
                        on: {
                          click: (e) => this.selectOnly(e, x),
                        },
                      },
                      'only'
                    ),
                    h('a', {
                      staticClass: ['pvtOnlySpacer'],
                    }),
                  ]
                );
              }),
              
            ]
          ),
          h(
            "div", 
            {
              staticClass: ["recordNumberContainer"]
            }, 
            [
            h("span",
              {
                staticClass: ["recordNumber"]
              },
              "Values found: " + Object.keys(values).length
            )
            ]
          )
        ]
      );
    },
    toggleFilterBox() {
      this.openFilterBox(this.name, !this.open);
      this.moveFilterBoxToTop(this.name);
    },
    openFilterBox(attribute, open) {
      this.$emit('open:filterbox', { attribute, open });
    },
  },
  render(h) {
    const filtered = Object.keys(this.valueFilter).length !== 0 ? 'pvtFilteredAttribute' : '';
    return h(
      'li',
      {
        attrs: {
          'data-id': !this.disabled ? this.name : undefined,
        },
      },
      [
        h(
          'span',
          {
            staticClass: ['pvtAttr ' + filtered],
            class: {
              sortonly: this.sortonly,
              disabled: this.disabled,
            },
          },
          [
            this.name,
            !this.disabled
              ? h(
                'span',
                {
                  staticClass: ['pvtTriangle'],
                  on: {
                    click: this.toggleFilterBox.bind(this),
                  },
                },
                '  ▾'
              )
              : undefined,
            this.open ? this.getFilterBox(h, this.name) : undefined,
          ]
        ),
      ]
    );
  },
};
