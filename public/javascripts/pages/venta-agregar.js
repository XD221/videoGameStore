function calPrice(){
    var cal = 0;
    $('#tbl tbody').find('.precio').each(function(){
        cal += parseFloat($(this).html());
    });
    $('#total2').val(cal.toFixed(1) + " Bs.");
    $('#total').val(cal.toFixed(1));
}

$( document ).ready(function() {
    calPrice();
    $('#btnCliente').click(function(){
        $('#form').attr('action', '/venta/seleccionar-cliente');
        $('#form').submit();
    });
    $('#btnProducto').click(function(){
        $('#form').attr('action', '/venta/seleccionar-producto');
        $('#form').submit();
    });
    
    $('.btnDelete').click(function(){
        var url = "/venta/agregar";
        var tipo = "DELETE";
        var datos = { prodID: $(this).parent().attr('id') };
        var tipoDatos = "JSON";
        solicitudAjax(url, (result) => {
            if(result.Success){
                toastr.success("Producto de la lista se ha eliminado satisfactoriamente");
                return;
            }
            toastr.error("El producto de la lista no existe en la lista");
        }, datos, tipoDatos, tipo);
        $(this).parent().parent().remove();
        calPrice();
    }
    );
    
    $('#submit').click(function(){
        if($('#tbl tbody').find('.precio').length > 0){
            if($('#clienteID').val().length > 0){
                $('#form').submit();
            }else{
                toastr.error("Agregue a un cliente");
            }
        }else{
            toastr.error("La lista de venta esta vacia");
        }
    });
    
});
