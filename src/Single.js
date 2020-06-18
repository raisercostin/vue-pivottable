export default {
  props: ['values'],
  render(h) {
    return h(
      'div',
      {
        staticClass: ['pvtDropdown'],
        attrs: {
          value: this.value,
        },
      },
      [
        this.values.map((r) => {
          return h(
            'p',
            {
              attrs: {
                value: r,
              },
            },
            r
          );
        }),
      ]
    );
  },
};
