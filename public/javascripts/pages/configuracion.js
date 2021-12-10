function guardarExitoso(respuesta) {
  if (respuesta.Success) {
    limpiarDatos();
    toastr.success("La contraseña se ha cambiado");
  } else {
    toastr.error(respuesta.Message);
  }
}

function guardar(id, elemento) {
  if(validarDatos() == true){
		var url = "/configuracion/modificar";
		var tipo = "POST";
		var datos = {
			id: id,
			passwd: $("#password").val()
		};
		var tipoDatos = "JSON";
		solicitudAjax(
			url,
			function (res) {
				guardarExitoso(res);
			},
			datos,
			tipoDatos,
			tipo
		);
  }else{
    limpiarDatos();
		return false;
	}
}

function limpiarDatos() {
  $("#password").val("");
  $("#confpass").val("");
}

$(document).ready(function () {
  $("#btnGuardar").click(function () {
    guardar(0);
  });
});

function validarDatos() {
	var password = document.getElementById("password").value;
	var confpass = document.getElementById("confpass").value;
	if(password.trim() == "" || confpass.trim() == ""){
		toastr.error("No deje espacios en blanco");
		return false;
	}
  if(password != confpass){
    toastr.error("Las contraseñas no coinciden");
		return false;
	}
	return true;
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

