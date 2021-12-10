var _datos;

function mostrarModal() {
  limpiarDatos();
  $("#chequearestado").hide();
  var modal = "#agregar";
  $(modal).find(".modal-title").html("Agregar Proveedor");
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
      "El proveedor: " + elemento.nombre + " se ha eliminado satisfactoriamente"
    );
  } else {
    toastr.error(respuesta.Message);
  }
}

function confirmarEliminar(e, elemento) {
  var url = "/proveedor/eliminar";
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
  $("#chequearestado").show();
  $("#nombre").val(elemento.nombre);
  $("#direccion").val(elemento.direccion);
  $("#telefono").val(elemento.telefono);
  $("#estado").prop('disabled', false);
  (elemento.estado == 0 ? $("#estado").prop('checked', true):$("#estado").prop('checked', false));
  $("#btnEditar").show();
  $("#btnGuardar").hide();
}

function mostrarEliminar(e, elemento) {
  var modal = "#eliminar";
  $(modal).find(".modal-title").html("Eliminar Proveedor");
  $(modal)
    .find(".text-mensaje-modal")
    .html(
      "¿Estas seguro que deseas eliminar al Proveedor: " + elemento.nombre + "?"
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
        .html("Editar Proveedor: " + elemento.nombre);
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
        direccion: $("#direccion").val(),
        telefono: $("#telefono").val(),
        estado: 0
      };
      _datos.push(nuevo);
    } else {
      //Modifico uno existente
      elemento.nombre = $("#nombre").val();
      elemento.direccion = $("#direccion").val();
      elemento.telefono = $("#telefono").val();
      elemento.estado = ($("#estado").prop('checked') ? 0:1);
    }
    mostrarDatos();
    toastr.success("El proveedor se ha guardado correctamente");
  } else {
    toastr.error(respuesta.Message);
  }
}

function Guardar(id, elemento) {
  if(validarDatos() == true){
		repararDatos();
		var url = "/proveedor/guardar";
		var tipo = "POST";
		if(id == 0){
      var datos = {
        id: id,
        nombre: $("#nombre").val(),
        direccion: $("#direccion").val(),
        telefono: $("#telefono").val(),
      };
    }else{
      var datos = {
        id: id,
        nombre: $("#nombre").val(),
        direccion: $("#direccion").val(),
        telefono: $("#telefono").val(),
        estado: ($("#estado").prop('checked') ? 0:1),
      };
    }
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
	}else{
		return false;
	}
}

function limpiarDatos() {
  $("#nombre").val("");
  $("#direccion").val("");
  $("#telefono").val("");
  $("#estado").prop('checked', true);
  $("#estado").prop('disabled', true);
  $("#btnEditar").hide();
  $("#btnGuardar").show();
}

function mostrarDatos() {
  limpiarTabla("tbl");
  $.each(_datos, function (index, elemento) {
    //var fila = $('<tr>').attr('id', elemento.id);
    var datoFila = [
      elemento.nombre,
      elemento.direccion,
      elemento.telefono,
      (elemento.estado == 0 ? "Disponible": "Suspendido"),
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
    _datos = resultado.Data;
    mostrarDatos();
    toastr.success("Datos adquirido exitosamente");
  } else {
    toastr.error(resultado.Message);
  }
}

function init() {
  var url = "/proveedor/obtener";
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
});

function validarDatos() {
	var nombre = document.getElementById("nombre").value;
	var direccion = document.getElementById("direccion").value;
	var telefono = document.getElementById("telefono").value;

	if(nombre.trim() == "" || direccion.trim() == "" || telefono.trim() == ""){
		toastr.error("No deje espacios en blanco");
		return false;
	}else{
		if(isNaN(telefono)){
			toastr.error("Ingrese un número de teléfono válido");
			return false;	
		}
	}
	return true;
}

function repararDatos(){
	var nombre = $("#nombre");
	var direccion = $("#direccion");
	
	nombre.val(nombre.val().trim());
	direccion.val(direccion.val().trim());	
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


