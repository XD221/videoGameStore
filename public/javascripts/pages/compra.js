var _datos;

function mostrarDatos() {
  limpiarTabla("tbl");
  $.each(_datos, function (index, elemento) {
    //var fila = $('<tr>').attr('id', elemento.id);
    var datoFila = [
      elemento.fecha,
      elemento.total + " Bs.",
      elemento.proveedor,
      elemento.empleado,
      (elemento.estado == 0)? 'Realizada':'Cancelada'
    ];
    var ultimaFila = agregarFila("tbl", datoFila, elemento.id);
    $(ultimaFila).find('td:first a').click(function(){
    //$('#tbl tbody').off().on('click', '.spanHyperLink', function(){
      var url = "/compra/obtenerDetalle";
      var tipo = "POST";
      var datos = { id: $(this).parent().parent().attr('id').split('_')[1] };
      var tipoDatos = "JSON";
      solicitudAjax(url, (resultado) => {
        if (resultado.Success) {
          limpiarTabla("tblModal");
          $.each(resultado.Data, function (key, value) {
            var datoFila = [
              "<img src='" + value.url + "' width='80' height='80' alt='NO IMAGE 404'>",
              value.nombre,
              value.cantidad,
              parseFloat(value.precio).toFixed(1)
            ];
            var ultimaFila = agregarFila("tblModal", datoFila, value.id);
          });
          mostrarDatos();
          toastr.success("Datos adquirido exitosamente");
        } else {
          toastr.error(resultado.Message);
        }
      }, datos, tipoDatos, tipo);
      var modal = "#modalTable";
      $(modal).find('.modal-title').html('Vista detalle de compra')
      $(modal)
        .find(".modal-dialog")
        .css({ "max-width": 50 + "vw" })
        .css({ "min-height": 100 + "%" });
      $(modal).modal({ backdrop: "static", keyboard: false });
      $(modal).modal("show");
    });
  });
}

function getExitoso(resultado) {
  if (resultado.Success) {
    _datos = resultado.Data;
    mostrarDatos();
    toastr.success("Datos adquirido exitosamente");
  } else {
    toastr.error(resultado.Message);
  }
}

function init() {
  var url = "/compra/obtener";
  var tipo = "GET";
  var datos = {};
  var tipoDatos = "JSON";
  solicitudAjax(url, getExitoso, datos, tipoDatos, tipo);
}

$(document).ready(function () {
  init();

  $('#tbl').DataTable({
    dom: '<"container"<"row"<"col-sm-4"B><"col-sm-4"l> <"col-sm-4"f>>><>rtip',
    buttons: [
      {
        extend: "print",
        text: "Imprimir",
        exportOptions: {
          columns: [0, 1, 2, 3],
        },
        className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
        filename: "Reporte de Compra",
        title: "Reporte de Compra"
      },
      {
        extend: 'pdf',
        text: 'PDF',
        exportOptions: {
          columns: [0, 1, 2, 3],
        },
        className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
        filename: "Reporte de Compra",
        title: "Reporte de Compra"
      }
    ],
    destroy: true,
    columnDefs: [
      //{aTargets: [-1], sTitle: "Accion"},
      {
        targets: 0,
        render: function (data, type, row, meta) {
          return '<a href="#"class="spanHyperLink" >' + data + "</a>"; //render link in cell
        },
      },
    ],
    createdRow: function (row, data, index) {
      $(row).addClass("blue"); //add class to row
      $("td", row).eq(0).css("font-weight", "bold"); //add style to cell in third column
    },
  });
  $('#tblModal').DataTable({
    dom: '<"container"<"row"<"col-sm-4"B><"col-sm-4"l> <"col-sm-4"f>>><>rtip', 
    buttons: [
      {
        extend: "print",
        text: "Imprimir",
        exportOptions: {
          columns: [1, 2, 3],
        },
        className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
        filename: "Reporte de Detalle de Compra",
        title: "Reporte de Detalle de Compra"
      },
      {
        extend: 'pdf',
        text: 'PDF',
        exportOptions: {
          columns: [1, 2, 3],
        },
        className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
        filename: "Reporte de Detalle de Compra",
        title: "Reporte de Detalle de Compra"
      }
    ],
    destroy: true, 
    columnDefs: [
        {
          targets: 0,
          createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
            $(cell).parent().attr("id", "row_" + rowIndex)
          }
        }
    ]
  });
});