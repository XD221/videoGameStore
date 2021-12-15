Array.prototype.remove = function (item) {
    var i = this.indexOf(item);
    if (i != -1)
        this.splice(i, 1);
};

function solicitudAjax(solicitudUrl, onSuccess, data, tipoDato, tipo) {
    $.ajax({
        type: tipo,
        datatype: tipoDato,
        traditional: false,
        url: solicitudUrl,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: data,
        success: function (responseText) {
            
            if (onSuccess)
                onSuccess(responseText);
        },
        error: function (exception) {
        }
    });
}

function limpiarTabla(elemento) {
    var tabla = $('#' + elemento).DataTable();
    tabla
        .clear()
        .draw();

}
function cambiarColumnas(elemento, columnas){
    var tabla = $('#' + elemento);
    tabla.DataTable().destroy();
    tabla.empty();
}

function agregarFila(elemento, fila, index){
    var tabla = $('#' + elemento).DataTable();
    var last_row = tabla
        .row
        .add( fila ).node();
    tabla.draw( );
    last_row.id ='row_' + index;
    return last_row;
}

function eliminarFila(elemento, fila){
    var tabla = $('#' + elemento).DataTable();
    tabla
    .row( fila )
    .empty()
    .draw( false );
}

function actualizarFila(elemento, fila, change){
    var tabla = $('#' + elemento).DataTable();
    tabla
    .row( fila )
    .data(change)
    .draw();
}

function adicionarOpcionesCombo(elemento, items, evento, prop) {
    prop = prop || { id: 'id', value: 'value' };
    $.each(items, function (index, item) {
        $(elemento).append($('<option>').val(item[prop.id]).text(item[prop.value]));
    });
    if (evento)
        $(elemento).change(function (e) { evento(e, $(elemento).val()); });
}