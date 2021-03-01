import TableRenderer from './TableRenderer'
import defaultProps from './helper/common'
export default {
  name: 'vue-pivottable',
  mixins: [
    defaultProps
  ],
  computed: {
    rendererItems () {
      return this.renderers || Object.assign({}, TableRenderer)
    }
  },
  methods: {
    createPivottable (h) {
      const props = this.$props
      return h(this.rendererItems[this.rendererName], {
        props: Object.assign(
          props,
          { localeStrings: props.locales[props.locale].localeStrings }
        )
      })
    },
    createWrapperContainer (h) {
      return h('div', {
        style: {
          display: 'block',
          'width': '100%',
          'overflow-y': 'auto',
          'overflow-x': 'scroll',
          'height': `${this.height}px`
        }
      }, [
        this.createPivottable(h)
      ])
    }
  },
  render (h) {
    return this.height > 0 ? this.createWrapperContainer(h) : this.createPivottable(h)
  }
}
