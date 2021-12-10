$( document ).ready(function() {
    $('#tbl').DataTable({
      destroy: true, 
      columnDefs: [
          {
            targets: 0,
            createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
              $(cell).parent().attr("id", "row_" + rowIndex)
            }
          }
      ]
    });
});