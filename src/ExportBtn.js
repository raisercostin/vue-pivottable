import * as XLSX from 'xlsx';
import * as html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import $ from 'jquery';

export default {
  created() {
    $(document).on('click', '.OuterExportDropDown', function () {
      showCheckboxes();
    });
    $(document).on('click', function (event) {
      hideExport(event);
    });
  },
  methods: {
    exportFile(format) {
      exportDocument('.pvtOutput', 'table.pvtTable', format);
    },
  },
  render(h) {
    return h('span', [
      h(
        'button',
        {
          staticClass: ['exportbtn'],
          on: {
            click: () => {
              this.exportFile('xlsx')
            }
          }
        },
        [h(
          "img",
          {
            staticClass: ["exportIcon"],
            attrs: {
              src: require(`@/assets/icon/Export-icon.png`)
            },
          }
        ),
          h(
            "span",
            'Export to Excel'
          )
        ]
      ),
      // h(
      //   'div',
      //   {
      //     staticClass: ['OuterExportFilterBox'],
      //   },
      //   [
      //     h(
      //       'button',
      //       {
      //         staticClass: ['greenBtn'],
      //         on: {
      //           click: () => this.exportFile('xlsx'),
      //         },
      //       },
      //       `Export XLSX`
      //     ),
      //     h(
      //       'button',
      //       {
      //         staticClass: ['greenBtn'],
      //         on: {
      //           click: () => this.exportFile('pdf'),
      //         },
      //       },
      //       `Export PDF`
      //     ),
      //     h(
      //       'button',
      //       {
      //         staticClass: ['greenBtn'],
      //         on: {
      //           click: () => this.exportFile('png'),
      //         },
      //       },
      //       `Export PNG`
      //     ),
      //   ]
      // ),
    ]);
  },
};

function exportDocument(parent, className, format) {
  format = format.toLowerCase();
  var fileName = 'Export';
  var table = $(className)[0];
  var parent = $(parent)[0];
  $(className).attr('border', '1');

  if (format === 'xlsx') {
    var wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet 1' });
    return XLSX.writeFile(wb, fileName + '.xlsx');
  } else if (format === 'png') {
    window.scrollTo(0, 0);
    html2canvas(parent, {
      allowTaint: true,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX
    }).then(function (canvas) {
      var donwloadLink = document.createElement('a');
      donwloadLink.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      donwloadLink.download = fileName + '.png';
      donwloadLink.target = '_blank';
      donwloadLink.style.display = 'none';

      document.body.appendChild(donwloadLink);
      donwloadLink.click();
      document.body.removeChild(donwloadLink);

      $(className).removeAttr('style');
    });
  } else if (format === 'pdf') {
    var doc = new jsPDF({ orientation: 'landscape' });
    doc.autoTable({
      theme: 'plain',
      styles: { halign: 'center', fillColor: [0, 131, 87], textColor: [0, 0, 0], lineWidth: 0.01, lineColor: [235, 240, 248] },
      headStyles: { halign: 'center', textColor: [255, 255, 255], fontStyle: 'normal' },
      bodyStyles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: { text: { cellWidth: 'wrap' }, 0: { halign: 'right', fillColor: [0, 131, 87], textColor: [255, 255, 255] } },
      margin: { top: 5, bottom: 5, left: 5, right: 5 },
      tableLineWidth: 0.01,
      tableLineColor: [235, 240, 248],
      html: table,
    });
    doc.save(fileName + '.pdf');
  }
}

var exportExpanded = false;

function showCheckboxes() {
  if (!exportExpanded) {
    $('.OuterExportFilterBox').show();
    exportExpanded = true;
  } else {
    $('.OuterExportFilterBox').hide();
    exportExpanded = false;
  }
}

function hideExport(event) {
  if (event.target != null && event.target.className != null && event.target.className !== 'OuterExportDropDown greenBtn') {
    $('.OuterExportFilterBox').hide();
    exportExpanded = false;
  }
}
