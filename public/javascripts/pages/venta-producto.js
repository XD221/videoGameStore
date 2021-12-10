var i = 0;

$('.submit').click(function(){
    var $form = $(this).parent();
    var $cantidad = $form.find('input.cantidad');
    var $rowCantidad = $('input[type=number]');
    $cantidad.val($form.parent().parent().find($rowCantidad).val());
    if(parseInt($cantidad.val()) > 0){
        i = 1;
    }else toastr.error("Agregue una cantidad");
    if(i != 0){
        $form.submit();
    }
});