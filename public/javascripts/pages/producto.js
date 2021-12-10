var _datos;

function mostrarModal() {
  limpiarDatos();
  var modal = "#agregar";
  $(modal).find(".modal-title").html("Agregar Producto");
  $(modal)
    .find(".modal-dialog")
    .css({ width: 700 + "px" });
  $(modal)
    .find(".modal-body")
    .css({ "min-height": 150 + "px" });
  $(modal).modal({ backdrop: "static", keyboard: false });
  $(modal).modal("show");
}

function eliminarExitoso(respuesta, e, elemento) {
  $("#eliminar").modal("hide");
  if (respuesta.Success) {
    eliminarFila("tbl", $(e).parents("tr"));
    _datos.remove(elemento);
    toastr.success(
      "El producto: " + elemento.nombre + " se ha eliminado satisfactoriamente"
    );
  } else {
    toastr.error(respuesta.Message);
  }
}

function confirmarEliminar(e, elemento) {
  var url = "/producto/eliminar";
  var tipo = "POST";
  var datos = {
    id: elemento.id,
  };
  var tipoDatos = "JSON";
  solicitudAjax(
    url,
    function (res) {
      eliminarExitoso(res, e, elemento);
    },
    datos,
    tipoDatos,
    tipo
  );
}

function mostrarEditar(elemento) {
  $("#nombre").val(elemento.nombre);
  $("#urlIMG").val(elemento.urlIMG);
  $("#precio").val(elemento.precio);
  $("#cantidad").val(elemento.cantidad);
  $("#categoria").val(elemento.id_categoria);
  $("#marca").val(elemento.id_marca);
  $("#btnEditar").show();
  $("#btnGuardar").hide();
}

function mostrarEliminar(e, elemento) {
  var modal = "#eliminar";
  $(modal).find(".modal-title").html("Eliminar Producto");
  $(modal)
    .find(".text-mensaje-modal")
    .html(
      "¿Estas seguro que deseas eliminar al Producto: " + elemento.nombre + "?"
    );
  $(modal)
    .find(".modal-body")
    .css({ "min-height": 100 + "px" });
  $(modal).modal({ backdrop: "static", keyboard: false });
  $(modal).modal("show");
  $("#btnEliminarAceptar")
    .unbind("click")
    .click(function () {
      confirmarEliminar(e, elemento);
    });
}

function eventoActualizar(input, elemento) {
  $(input)
    .find("td:first")
    .unbind("click")
    .click(function () {
      mostrarEditar(elemento);
      var modal = "#agregar";
      $(modal)
        .find(".modal-title")
        .html("Editar Producto: " + elemento.nombre);
      $(modal)
        .find(".modal-dialog")
        .css({ width: 700 + "px" });
      $(modal)
        .find(".modal-body")
        .css({ "min-height": 150 + "px" });
      $(modal).modal({ backdrop: "static", keyboard: false });
      $(modal).modal("show");
      $("#btnEditar")
        .unbind("click")
        .click(function (event) {
          event.preventDefault();
          Guardar(elemento.id, elemento);
        });
    });
}

function guardarExitoso(respuesta, elemento) {
  if (respuesta.Success) {
    $("#agregar").modal("hide");
    if (!elemento) {
      //Guardar uno nuevo
      var nuevo = {
        id: parseInt(respuesta.Data),
        nombre: $("#nombre").val(),
        urlIMG: $("#urlIMG").val(),
        precio: $("#precio").val(),
        cantidad: $("#cantidad").val(),
        id_categoria: $("#categoria").val(),
        categoria: $("#categoria option:selected").text(),
        id_marca: $("#marca").val(),
        marca: $("#marca option:selected").text(),
      };
      _datos.push(nuevo);
    } else {
      //Modifico uno existente
      elemento.nombre = $("#nombre").val();
      elemento.urlIMG = $("#urlIMG").val();
      elemento.precio = $("#precio").val();
      elemento.cantidad = $("#cantidad").val();
      elemento.id_categoria = $("#categoria").val();
      elemento.categoria = $("#categoria option:selected").text();
      elemento.id_marca = $("#marca").val();
      elemento.marca = $("#marca option:selected").text();
    }
    mostrarDatos();
    toastr.success("El producto se ha guardado correctamente");
  } else {
    toastr.error(respuesta.Message);
  }
}

function Guardar(id, elemento) {
	if(validarDatos() == true){
		repararDatos();
		var url = "/producto/guardar";
		var tipo = "POST";
		var datos = {
			id: id,
			nombre: $("#nombre").val(),
			urlIMG: $("#urlIMG").val(),
			precio: $("#precio").val(),
			cantidad: $("#cantidad").val(),
			id_categoria: $("#categoria").val(),
			id_marca: $("#marca").val(),
		};
		var tipoDatos = "JSON";
		solicitudAjax(
			url,
			function (res) {
				guardarExitoso(res, elemento);
			},
			datos,
			tipoDatos,
			tipo
		);
	}
}

function limpiarDatos() {
  $("#nombre").val("");
  $("#urlIMG").val("");
  $("#precio").val("");
  $("#cantidad").val("");
  $("#categoria").prop("selectedIndex", 0);
  $("#marca").prop("selectedIndex", 0);
  $("#btnEditar").hide();
  $("#btnGuardar").show();
}

function mostrarDatos() {
  limpiarTabla("tbl");
  $.each(_datos, function (index, elemento) {
    //var fila = $('<tr>').attr('id', elemento.id);
    var datoFila = [
      elemento.nombre,
      "<img src='" + elemento.urlIMG + "' width='80' height='80' alt='NO IMAGE 404'>",
      elemento.precio + " Bs.",
      elemento.cantidad + " U.",
      elemento.categoria,
      elemento.marca,
      "<button class='btn btn-outline-primary btn-sm' id='btnEliminar_" +
        elemento.id +
        "' ><img src='/icons/trash.svg' alt='Eliminar'></button",
    ];
    var ultimaFila = agregarFila("tbl", datoFila, elemento.id);
    eventoActualizar(ultimaFila, elemento);
    $(ultimaFila).find("#btnEliminar_" + elemento.id).click(function () {
      mostrarEliminar(this, elemento);
    });
  });
}

function getExitoso(resultado) {
  if (resultado.Success) {
    _datos = resultado.Data.Producto;
    $.each(resultado.Data.Categoria, function (key, value) {
      $("#categoria").append(
        $("<option>").attr("value", value.id).text(value.nombre)
      );
    });
    $.each(resultado.Data.Marca, function (key, value) {
      $("#marca").append(
        $("<option>").attr("value", value.id).text(value.nombre)
      );
    });
    mostrarDatos();
    toastr.success("Datos adquirido exitosamente");
  } else {
    toastr.error(resultado.Message);
  }
}

function init() {
  var url = "/producto/obtener";
  var tipo = "GET";
  var datos = {};
  var tipoDatos = "JSON";
  solicitudAjax(url, getExitoso, datos, tipoDatos, tipo);
}

$(document).ready(function () {
  init();
  $("#btnAgregar").click(function () {
    mostrarModal();
  });
  $("#btnCancelar").click(function () {
    $("#agregar").modal("hide");
    limpiarDatos();
  });
  $("#btnGuardar").click(function () {
    Guardar(0);
  });
  $("#btnCancelarEliminar").click(function () {
    $("#eliminar").modal("hide");
  });
  $('#tbl').DataTable({
    dom: '<"container"<"row"<"col-sm-4"B><"col-sm-4"l> <"col-sm-4"f>>><>rtip',
    buttons: [
      {
        extend: "print",
        text: "Imprimir",
        title: "Reporte de Producto" ,
        exportOptions: {
          columns: [0, 2, 3, 4, 5],
        },
        className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
        filename: "Reporte de Producto",
        title: "Reporte de Producto",
        
      },
      {
        extend: 'pdf',
        text: 'PDF',
        exportOptions: {
          columns: [0, 2, 3, 4, 5],
        },
        className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
        filename: "Reporte de Producto",
        title: "Reporte de Producto",
      },
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
});


function validarDatos() {
	var nombre = document.getElementById("nombre").value;
	var precio = document.getElementById("precio").value;
	var cantidad = document.getElementById("cantidad").value;

	if(nombre.trim() == "" || precio.trim() == "" || cantidad.trim() == ""){
		toastr.error("No deje espacios en blanco");
		return false;
	}else{
		if(isNaN(precio)){
			toastr.error("Ingrese un precio válido");
			return false;
		}
		if(isNaN(cantidad)){
			toastr.error("Ingrese una cantidad válida");
			return false;
		}
	}
	return true;
}

function repararDatos(){
	var nombre = $("#nombre");
	nombre.val(nombre.val().trim());	
}

$('#form').keydown(function (e) {
	if (e.ctrlKey || e.altKey || e.keyCode == 13) {
		e.preventDefault();
		return false;
	}
});
$('#form').keypress(function (e) {
	if (e.ctrlKey || e.altKey || e.keyCode == 13) {
		e.preventDefault();
		return false;
	}
});
