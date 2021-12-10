var i = 0;

$('.submit').click(function(){
    var $form = $(this).parent();
    var $cantidad = $form.find('input.cantidad');
    var $precio = $form.find('input.precio');
    $cantidad.val($form.parent().parent().find($('input[type=number]')).eq(1).val());
    $precio.val(parseFloat($form.parent().parent().find($('input[type=number]')).eq(0).val()));
    if(parseInt($cantidad.val()) > 0){
        if(parseFloat($precio.val()) > parseFloat(0)){
            i = 1;
        }else toastr.error("Agregue un precio");
    }else toastr.error("Agregue una cantidad");
    if(i != 0){
        $form.submit();
    }
});