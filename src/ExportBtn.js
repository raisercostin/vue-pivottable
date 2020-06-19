import JQuery from 'jquery'

export default {
  props: ['values'],
  mounted () {
    console.log('test')
    JQuery(document).on('click', '.exportbtn', function () {
      exportTableToExcel()
    })
  },
  render (h) {
    return h(
      'button',
      {
        staticClass: ['exportbtn'],
        attrs: {
          role: 'button'
        }
      }, 'Export'
    )
  }
}

function exportTableToExcel (filename = '') {
  var downloadLink
  var dataType = 'application/vnd.ms-excel'
  JQuery('table.pvtTable').attr('border', '1')
  var tableSelect = document.getElementsByClassName('pvtTable')
  var tableHTML = tableSelect[0].outerHTML.replace(/ /g, '%20')

  filename = filename ? filename + '.xls' : 'excel_data.xls'
  downloadLink = document.createElement('a')
  document.body.appendChild(downloadLink)

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(['\ufeff', tableHTML], {
      type: dataType
    })

    navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML
    downloadLink.download = filename
    downloadLink.click()
  }
}
