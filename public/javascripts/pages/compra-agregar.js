var $tbl;

function calPrice(){
    var cal = 0.0;
    $('#tbl tbody').find('.precio').each(function(){
        cal += Number($(this).html());
    });
    $('#total2').val(cal.toFixed(1) + " Bs.");
    $('#total').val(cal.toFixed(1));
}

$(document).ready(function () {
    $.each($('#tbl tbody').find('tr'), (key, value) => {
        $(value).find('#btnEliminar_' + $(value).attr('id').split('_')[1]).click(function(){
            var url = "/compra/agregar";
            var tipo = "DELETE";
            var datos = { prodID: $(value).attr('id').split('_')[1] };
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
        });
    });
    $tbl = $('#tbl').DataTable({
      dom: 'Blfrtip',
      destroy: true,
      pageLength : 5,
      lengthMenu: [[5, 10], [5, 10]],
      columnDefs: [{
          targets: 2,
          className: 'precio'
      }],
      buttons: [
        {
          extend: "print",
          text: "Imprimir",
          title: "Reporte de Producto" ,
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },
          className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
          filename: "Reporte de Compra",
          title: "Reporte de Compra",
          
        },
        {
          extend: 'pdf',
          text: 'PDF',
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },
          className: "btn btn-warning mb-2 mt-2 ml-2 fw-bold text-dark",
          filename: "Reporte de Compra",
          title: "Reporte de Compra",
        },
      ],
    });
    $($tbl.buttons([1, 0]).nodes()).hide();
    $('#tblProveedor').DataTable({
      destroy: true,
      pageLength : 5,
      lengthMenu: [[5, 10], [5, 10]],
      columnDefs: [
          {
            targets: 0,
            createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
              $(cell).parent().attr("id", "row_" + rowIndex)
            }
          }
      ]
    });
    $('#tblProducto').DataTable({
        destroy: true,
        pageLength : 5,
        lengthMenu: [[5, 10], [5, 10]],
        columnDefs: [
            {
              targets: 0,
              createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
                $(cell).parent().attr("id", "row_" + rowIndex)
              }
            }
        ]
      });
    calPrice();
    $('#btnProducto').click(function(){
        $('#modalProducto').modal('show');
    });
    $('.btnAgregar').click(function(){
        var duplicate = false;
        var productoID = $(this).parent().find("input[name=prodID]").val();
        var productoNombre = $(this).parent().find("input[name=prodNombre]").val();
        var precio = $(this).parent().parent().find($('input[type=number]')).eq(0).val();
        var categoria = $(this).parent().find("input[name=categoria]").val();
        var marca = $(this).parent().find("input[name=marca]").val();
        var cantidad = $(this).parent().parent().find($('input[type=number]')).eq(1).val();
        if(parseInt(cantidad) == 0 ){
            toastr.error("Cantidad invalido, agregue un valor mayor a 0");
            return;
        }
        if(parseFloat(precio) == parseFloat(0)){
            toastr.error("Precio invalido, agregue un valor mayor a 0");
            return;
        }
        $('#modalProducto').modal('hide');
        $(this).parent().parent().find($('input[type=number]')).eq(0).val('0');
        $(this).parent().parent().find($('input[type=number]')).eq(1).val('0');
        var datoFila = [
            productoNombre,
            cantidad,
            parseFloat(precio * cantidad).toFixed(1),
            categoria,
            marca,
            "<div class='btn btn-outline-primary btn-sm' id='btnEliminar_" +
            $(this).parent().find("input[name=prodID]").val() +
            "' ><img src='/icons/trash.svg' alt='Eliminar'></div"
        ];
        var url = "/compra/agregar";
        var tipo = "PUT";
        var datos = { 
            prodNombre: productoNombre,
            precio: (parseFloat(precio).toFixed(1)).toString(),
            cantidad: cantidad,
            categoria: categoria,
            marca: marca,
            prodID: productoID 
        };
        var tipoDatos = "JSON"
        solicitudAjax(url, (result) => {
            if(result.Success){
                var _data = {};
                toastr.success("Producto agregado al carrito de compras");
                $.each($('#tbl tbody').find('tr'), (key, value) => {
                    var id = $(value).attr('id');
                    if(id == undefined){
                        return false;
                    }
                    id = id.toString().split('_')[1];
                    _data[id] = value;
                    if(id == productoID.toString()){
                        actualizarFila('tbl', $(value), datoFila);
                        duplicate = true;
                    }
                });
                if(!duplicate){
                    limpiarTabla('tbl');
                    $.each(_data, (key, value) => {
                        var ultimaFila = agregarFila("tbl", value, $(value).attr('id').split('_')[1]);
                    });
                    var ultimaFila = agregarFila("tbl", datoFila, productoID);
                    $(ultimaFila).off().find('#btnEliminar_' + $(ultimaFila).attr('id').split('_')[1]).click(function(){
                        var url = "/compra/agregar";
                        var tipo = "DELETE";
                        var datos = { prodID: $(ultimaFila).attr('id').split('_')[1] };
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
                    });
                }
                calPrice();
                
            }else{
                toastr.error("El producto no se agrego al carrito de compra por datos invalidos");
            }
        }, datos, tipoDatos, tipo);
    });

    $('.btnAgregarProveedor').click(function(){
        $("#proveedorID").val($(this).parent().find('input[name=prID]').val());
        $("#proveedor").val($(this).parent().find('input[name=prNombre]').val());
    });

    $('#submit').click(function(){
        if($('#tbl tbody').find('.precio').length > 0){
            if($('#proveedorID').val().length > 0){
                $tbl.button(1).trigger();
                $('#form').submit();
            }else{
                toastr.error("Agregue un proveedor");
            }
        }else{
            toastr.error("El carrito de compra esta vacia");
        }
    });
});


