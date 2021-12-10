const charts = document.querySelectorAll(".chart");

charts.forEach(function (chart) {
  var ctx = chart.getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
$(document).ready(function () {
  $(".data-table").each(function (_, table) {
    $(table).DataTable({
      "destroy": true,
      columnDefs: [
        //{aTargets: [-1], sTitle: "Accion"},
        {
          targets: 0,
          createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
            //$(cell).css('color', 'green');
            $(cell).attr("id", "Edit_" + rowIndex);
            $(cell).parent().attr("id", "row_" + rowIndex)
          }
        },
        {
          targets: 0,
          render: function (data, type, row, meta) {
            return '<a href="#"class="spanHyperLink" >'+ data +'</a>';  //render link in cell
          }
        }
      ],
      createdRow: function (row, data, index) {
         $(row).addClass('blue');   //add class to row
         $('td', row).eq(0).css('font-weight', 'bold');  //add style to cell in third column
      }
      
    });
  });
});
