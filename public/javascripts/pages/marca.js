var _datos;

function mostrarModal() {
  limpiarDatos();
  var modal = "#agregar";
  $(modal).find(".modal-title").html("Agregar Marca");
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
      "La marca: " + elemento.nombre + " se ha eliminado satisfactoriamente"
    );
  } else {
    toastr.error(respuesta.Message);
  }
}

function confirmarEliminar(e, elemento) {
  var url = "/marca/eliminar";
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
  $("#btnEditar").show();
  $("#btnGuardar").hide();
}

function mostrarEliminar(e, elemento) {
  var modal = "#eliminar";
  $(modal).find(".modal-title").html("Eliminar Marca");
  $(modal)
    .find(".text-mensaje-modal")
    .html(
      "¿Estas seguro que deseas eliminar la Marca: " + elemento.nombre + "?"
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
        .html("Editar Marca: " + elemento.nombre);
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
      };
      _datos.push(nuevo);
    } else {
      //Modifico uno existente
      elemento.nombre = $("#nombre").val();
    }
    mostrarDatos();
    toastr.success("La marca se ha guardado correctamente");
  } else {
    toastr.error(respuesta.Message);
  }
}

function Guardar(id, elemento) {
	if(validarDatos() == true){
		repararDatos();
		var url = "/marca/guardar";
		var tipo = "POST";
		var datos = {
			id: id,
			nombre: $("#nombre").val(),
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
  $("#btnEditar").hide();
  $("#btnGuardar").show();
}

function mostrarDatos() {
  limpiarTabla("tbl");
  $.each(_datos, function (index, elemento) {
    //var fila = $('<tr>').attr('id', elemento.id);
    var datoFila = [
      elemento.nombre,
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
  var url = "/marca/obtener";
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
	if(nombre.trim() == ""){
		toastr.error("No deje espacios en blanco");
		return false;
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


