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
        },
        'Save Template'
      ),
    ]);
  },
};