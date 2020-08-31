export default {
  created() {

  },
  methods: {

  },
  render(h) {
    return h('span', [
      h(
        'button',
        {
          staticClass: ['pvtSave greenBtn'],
          on: {
            click: () => this.$emit("create")
          }
        },
        'Save Template'
      ),
    ]);
  },
};