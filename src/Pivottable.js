import TableRenderer from './TableRenderer'
import defaultProps from './helper/defaultProps'
export default {
  name: 'vue-pivottable',
  props: ['tableMaxWidth'],
  mixins: [defaultProps],
  computed: {
    renderers () {
      return TableRenderer[this.rendererName in TableRenderer ? this.rendererName : Object.keys(TableRenderer)[0]]
    }
  },
  methods: {
    createPivottable (h) {
      const props = this.$props
      const scopedSlots = this.$scopedSlots
      return h(this.renderers, {
        props,
        scopedSlots
      })
    },
    createWrapperContainer (h) {
      return h('div', {
        style: {
          display: 'block',
          // width: '100%',
          'overflow-x': 'auto',
          'max-width': `${this.tableMaxWidth}px`
        }
      }, [
        this.createPivottable(h)
      ])
    }
  },
  render (h) {
    return this.tableMaxWidth > 0 ? this.createWrapperContainer(h) : this.createPivottable(h)
  }
}
