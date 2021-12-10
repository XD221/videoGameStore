$('form').submit(function( event ) {    //$('#password').val(MD5($('#password').val()));
    $('#password').val(md5($('#pwd').val()));
});