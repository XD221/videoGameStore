var _datos;

function mostrarModal() {
  limpiarDatos();
  var modal = "#agregar";
  $(modal).find(".modal-title").html("Agregar Cliente");
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
      "El cliente: " + elemento.nombre + " se ha eliminado satisfactoriamente"
    );
  } else {
    toastr.error(respuesta.Message);
  }
}

function confirmarEliminar(e, elemento) {
  var url = "/cliente/eliminar";
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
  var indx = -1;
  for (var i = 0; i < elemento.ci.length; i++) {
    if (isNaN(elemento.ci[i])) {
      indx = i;
      break;
    }
  }
  var ci = [
    String(elemento.ci).substr(0, indx),
    String(elemento.ci).substr(indx),
  ];
  $("#ci").val(ci[0]);
  $("#pais").val(ci[1]);
  $("#nombre").val(elemento.nombre);
  $("#apPaterno").val(elemento.apPaterno);
  $("#apMaterno").val(elemento.apMaterno);
  $("#telefono").val(elemento.telefono);
  $("#btnEditar").show();
  $("#btnGuardar").hide();
}

function mostrarEliminar(e, elemento) {
  var modal = "#eliminar";
  $(modal).find(".modal-title").html("Eliminar Cliente");
  $(modal)
    .find(".text-mensaje-modal")
    .html(
      "¿Estas seguro que deseas eliminar al Cliente: " + elemento.nombre + "?"
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
        .html("Editar Cliente: " + elemento.nombre);
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
				ci: $("#ci").val(),
				nombre: $("#nombre").val(),
				apPaterno: $("#apPaterno").val(),
				apMaterno: $("#apMaterno").val(),
				telefono: $("#telefono").val(),
			};
			_datos.push(nuevo);
		} else {
			//Modifico uno existente
			elemento.ci = $("#ci").val() + $("#pais").val();
			elemento.nombre = $("#nombre").val();
			elemento.apPaterno = $("#apPaterno").val();
			elemento.apMaterno = $("#apMaterno").val();
			elemento.telefono = $("#telefono").val();
		}
		mostrarDatos();
		toastr.success("El cliente se ha guardado correctamente");
	} else {
		toastr.error(respuesta.Message);
	}
}

function Guardar(id, elemento) {
  if(validarDatos() == true){
		repararDatos();
		var url = "/cliente/guardar";
		var tipo = "POST";
		var datos = {
			id: id,
			ci: $("#ci").val() + $("#pais").val(),
			nombre: $("#nombre").val(),
			apPaterno: $("#apPaterno").val(),
			apMaterno: $("#apMaterno").val(),
			telefono: $("#telefono").val(),
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
	}else{
		return false;
	}
}

function limpiarDatos() {
  $("#ci").val("");
  $("#pais").prop("selectedIndex", 0);
  $("#nombre").val("");
  $("#apPaterno").val("");
  $("#apMaterno").val("");
  $("#telefono").val("");
  $("#btnEditar").hide();
  $("#btnGuardar").show();
}

function mostrarDatos() {
  limpiarTabla("tbl");
  $.each(_datos, function (index, elemento) {
    //var fila = $('<tr>').attr('id', elemento.id);
    var datoFila = [
      elemento.ci,
      elemento.nombre,
      elemento.apPaterno,
      elemento.apMaterno,
      elemento.telefono,
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
  var url = "/cliente/obtener";
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
	var ci = document.getElementById("ci").value;
	var nombre = document.getElementById("nombre").value;
	var apPaterno = document.getElementById("apPaterno").value;
	var apMaterno = document.getElementById("apPaterno").value;
	var telefono = document.getElementById("telefono").value;
	if(nombre.trim() == "" || ci.trim() == "" || apPaterno.trim() == "" ||
	apMaterno.trim() == "" || telefono.trim() == ""){
		toastr.error("No deje espacios en blanco");
		return false;
	}else{
		if(isNaN(ci) || ci.length <= 6){
			toastr.error("Ingrese un CI válido");
			return false;
		}
		if(isNaN(telefono) || telefono.length < 8 ){
			toastr.error("Ingrese un número de teléfono válido");
			return false;
		}
		return true;
	}
}

function repararDatos(){
	var nombre = $("#nombre");
	var apPaterno = $("#apPaterno");
	var apMaterno = $("#apMaterno");

	nombre.val(nombre.val().toLowerCase().replace(/\b[a-z]/g, function(letra) {
		return letra.toUpperCase();
	}));
	nombre.val(nombre.val().trim());
	
	apPaterno.val(apPaterno.val().toLowerCase().replace(/\b[a-z]/g, function(letra) {
		return letra.toUpperCase();
	}));
	apPaterno.val(apPaterno.val().trim());
	
	apMaterno.val(apMaterno.val().toLowerCase().replace(/\b[a-z]/g, function(letra) {
		return letra.toUpperCase();
	}));
	apMaterno.val(apMaterno.val().trim());
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
