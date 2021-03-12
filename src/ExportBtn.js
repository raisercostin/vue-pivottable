import TableToExcel from "@linways/table-to-excel";
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
      exportDocument('table.pvtTable', format);
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
      )
    ]);
  },
};

function exportDocument(className, format) {
  format = format.toLowerCase();
  $(className).attr('border', '1');
  var table = $(className)[0];

  if (format === 'xlsx') {
    return TableToExcel.convert(table);;
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
