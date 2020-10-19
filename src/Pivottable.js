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
          width: '100%',
          'overflow-x': 'auto',
          'max-width': this.tableMaxWidth ? `${this.tableMaxWidth}px` : undefined
        }
      }, [
        this.createPivottable(h)
      ])
    },
    exportXls (filename = 'pivot_data.xls') {
      const tableHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>Sheet 1</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook></xml>
            <![endif]-->
            <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
          </head>
          <body>
            ${document.getElementById(`pivottable${this.$vnode.key}`).outerHTML}
          </body>
        </html>
      `
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)
      downloadLink.href = `data:application/vnd.ms-excel;base64,${window.btoa(unescape(encodeURIComponent(tableHtml)))}`
      downloadLink.download = filename
      downloadLink.click()
    }
  },
  render (h) {
    return this.createWrapperContainer(h)
  },
  renderError (h, error) {
    return this.renderError(h)
  }
}
