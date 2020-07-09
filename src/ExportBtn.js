import * as XLSX from 'xlsx';
import * as html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import $ from 'jquery';

export default {
  mounted() {
    $(document).on('click', '.OuterExportDropDown', function() {
      showCheckboxes();
    });
    $(document).on('click', function(event) {
      hideExport(event);
    });
  },
  methods: {
    exportFile(format) {
      exportDocument('table.pvtTable', format);
    },
  },
  render(h) {
    return h('span', [
      h(
        'button',
        {
          staticClass: ['OuterExportDropDown greenBtn'],
        },
        'Select Export Column Fields  ▾'
      ),
      h(
        'div',
        {
          staticClass: ['OuterExportFilterBox'],
        },
        [
          h(
            'button',
            {
              staticClass: ['greenBtn'],
              on: {
                click: () => this.exportFile('xlsx'),
              },
            },
            `Export XLSX`
          ),
          h(
            'button',
            {
              staticClass: ['greenBtn'],
              on: {
                click: () => this.exportFile('pdf'),
              },
            },
            `Export PDF`
          ),
          h(
            'button',
            {
              staticClass: ['greenBtn'],
              on: {
                click: () => this.exportFile('png'),
              },
            },
            `Export PNG`
          ),
        ]
      ),
    ]);
  },
};

function exportDocument(className, format) {
  format = format.toLowerCase();
  var fileName = 'Export';
  var table = $(className)[0];
  $(className).attr('border', '1');

  if (format === 'xlsx') {
    var wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet 1' });
    return XLSX.writeFile(wb, fileName + '.xlsx');
  } else if (format === 'png') {
    html2canvas(table).then(function(canvas) {
      var image = canvas.toDataURL();
      var byteString = atob(image.substring(22)); // remove data stuff
      var buffer = new ArrayBuffer(byteString.length);
      var intArray = new Uint8Array(buffer);
      for (var i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      saveToFile(buffer, fileName + '.png', 'image/png', '', '', false);
    });
  } else if (format === 'pdf') {
    var doc = new jsPDF({ orientation: 'landscape' });
    doc.autoTable({
      theme: 'plain',
      styles: { halign: 'center', fillColor: [0, 131, 87], textColor: [0, 0, 0], lineWidth: 0.01, lineColor: [235, 240, 248] },
      headStyles: { halign: 'center', textColor: [255, 255, 255], fontStyle: 'normal' },
      bodyStyles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: { 0: { halign: 'right', fillColor: [0, 131, 87], textColor: [255, 255, 255] } },
      margin: { top: 5, bottom: 5, left: 5, right: 5 },
      tableLineWidth: 0.01,
      tableLineColor: [235, 240, 248],
      html: table,
    });
    doc.save(fileName + '.pdf');
  }
}

// save file
function saveToFile(data, fileName, type, charset, encoding, bom) {
  var header = 'data:' + type + (charset.length ? ';charset=' + charset : '') + (encoding.length ? ';' + encoding : '') + ',';
  var data = bom ? '\ufeff' + data : data;
  var DownloadLink = document.createElement('a');

  if (DownloadLink) {
    var blobUrl = null;
    DownloadLink.style.display = 'none';
    DownloadLink.download = fileName;
    DownloadLink.target = '_blank';

    if (typeof data === 'object') {
      window.URL = window.URL || window.webkitURL;
      var binaryData = [];
      binaryData.push(data);
      blobUrl = window.URL.createObjectURL(new Blob(binaryData, { type: header }));
      DownloadLink.href = blobUrl;
    } else if (header.toLowerCase().indexOf('base64,') >= 0) {
      DownloadLink.href = header + base64encode(data);
    } else {
      DownloadLink.href = header + encodeURIComponent(data);
    }

    document.body.appendChild(DownloadLink);

    // Click and remove
    DownloadLink.click();
    setTimeout(function() {
      if (blobUrl) window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(DownloadLink);
    }, 100);
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
