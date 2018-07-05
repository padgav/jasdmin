
var datagraph;
var myLineChart;
var ore = Array();


document.getElementById("mytable").addEventListener("crs4budgetchanged", function(e){

  ///chart.data.labels.pop();
  myLineChart.data.labels.pop();
  myLineChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
  });
  myLineChart.update();

  var event = new CustomEvent("crs4projectselected", {detail: e.detail.prid})

   document.getElementById("projects").dispatchEvent(event);


})




document.getElementById("projects").addEventListener("crs4projectselected", function(e){
  
  //console.log("event", e);
  var params="projectid=" + e.detail;


  
  serverRequest(params, function(obj){

  

var labels = Array();
var massimo = 0;
datagraph = obj.data;
  for(i = 0; i< obj.data.length; i++){
    var o  = parseInt(obj.data[i].ore);
    ore.push(o);
    labels.push(obj.data[i].mese + " " + obj.data[i].anno );
    if(o > massimo) {
      massimo = o;
    }
  }



Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
var ctx = document.getElementById("myAreaChart");
 myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: "Preventivo",
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: ore,
    }
    
  
  
  ],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: massimo,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: true
    }
  }
});
}, "crs4/graph.php");

});

// -- Bar Chart Example
// var ctx = document.getElementById("myBarChart");
// var myLineChart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [{
//       label: "Revenue",
//       backgroundColor: "rgba(2,117,216,1)",
//       borderColor: "rgba(2,117,216,1)",
//       data: [4215, 5312, 6251, 7841, 9821, 14984],
//     }],
//   },
//   options: {
//     scales: {
//       xAxes: [{
//         time: {
//           unit: 'month'
//         },
//         gridLines: {
//           display: false
//         },
//         ticks: {
//           maxTicksLimit: 6
//         }
//       }],
//       yAxes: [{
//         ticks: {
//           min: 0,
//           max: 15000,
//           maxTicksLimit: 5
//         },
//         gridLines: {
//           display: true
//         }
//       }],
//     },
//     legend: {
//       display: false
//     }
//   }
// });
// // -- Pie Chart Example
// var ctx = document.getElementById("myPieChart");
// var myPieChart = new Chart(ctx, {
//   type: 'pie',
//   data: {
//     labels: ["Blue", "Red", "Yellow", "Green"],
//     datasets: [{
//       data: [12.21, 15.58, 11.25, 8.32],
//       backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'],
//     }],
//   },
// });
