
function serverRequest(params, callback, url = "crs4/table.php") {

    console.log(">>>>> ", params);
    var httpc = new XMLHttpRequest(); // simplified for clarity
    //var url = "crs4/table.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    httpc.onreadystatechange = function () { //Call a function when the state changes.
        if (httpc.readyState == 4 && httpc.status == 200) { // complete and no errors

            var obj = JSON.parse(httpc.responseText);
            console.log("<<<<< ", obj);
            callback(obj);
        }
    }
    httpc.send(params);

}

serialize = function (obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}


function logout() {

    var params = "cmd=logout";
    serverRequest(params, function (obj) {
        console.log(obj);
        if (obj.status.code == 105) {
            location.reload();
        }
    })
}
var uidnumber;
var projects;
var notes;
var budget;


$(document).ready(function () {
    // Handler for .ready() called.


    var params = "cmd=getUserInfo";

    serverRequest(params, function (obj) {

        if (obj.status.code == 102) $("#crs4loginform").show();
        if (obj.status.code == 101) {
            $("#crs4maincontainer").show();
            $("#crs4loginform").hide();
            $("#crs4userinfo").html(obj.data.cn);

            uidnumber = obj.data.uidnumber;
            projects = new JasdminProject("projects");
            notes = new JasdminNotes({ notes: "crs4notes", button: "crs4notesbutton", textarea: "crs4notestext", item: "crs4notesitem" });
            budget = new JasdminBudget("mytable");


            document.getElementById("projects").addEventListener("crs4projectselected", function (e) {
                notes.setProject(e.detail)
                budget.setProject(e.detail);
                //  
            });

            document.getElementById("projects").addEventListener("crs4projectsupdated", function (e) {
                notes.setProject(e.detail)
                budget.setProject(e.detail);
                //  
            })


            //getBudget(8070);
            $('#dataTable').DataTable();
            $('#dataTable2').DataTable();
        }

    })


    document.getElementById("crs4personale").addEventListener("click", function(e){
        $("#crs4budget").hide();
        $("#crs4personale").show();
        
        var personale = new JasdminHr("crs4personalebody", "crs4personaleaggiungi", "crs4personaleaggiungibutton");
        

    })


    document.getElementById("crs4login").addEventListener("click", function (e) {

        var username = document.getElementById("crs4username").value;
        var password = document.getElementById("crs4password").value;

        var params = "cmd=login&username=" + username + "&password=" + password;
        serverRequest(params, function (obj) {
            console.log(obj);
            if (obj.status.code == 102) {
                $("#crs4loginform").show();
                alert("Login Incorrect");
            }
            if (obj.status.code == 101) {
                $("#crs4maincontainer").show();
                $("#crs4loginform").hide();
                $("#crs4userinfo").html(obj.data.cn);
                getProjects();
                getBudget(8070);
            }

        })
    })

});




function aggiornaore(ore, obj) {
    console.log("obj", obj)
    obj.oldore = obj.ore;
    obj.ore = ore;
    var event = new CustomEvent("crs4budgetchanged", { detail: obj })
    //console.log("chiamo aggiornaore",  obj);

    var params = serialize(obj);
    console.log(params);
    var httpc = new XMLHttpRequest(); // simplified for clarity
    var url = "crs4/aggiornaore.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    httpc.onreadystatechange = function () { //Call a function when the state changes.
        if (httpc.readyState == 4 && httpc.status == 200) { // complete and no errors

            var obj = JSON.parse(httpc.responseText);

            document.getElementById("status").innerHTML = obj.status;
            if (obj.status != "OK") {
                document.getElementById("status").className = "bg-danger";
            }
            else {
                //document.getElementById("mytable").dispatchEvent(event);
                document.getElementById("status").className = "bg-success";
                document.getElementById("costoprogetto").innerHTML = obj.tot;


                // var ctx = document.getElementById("myBarChart");
                // var myLineChart = new Chart(ctx, {
                //     type: 'bar',
                //     data: {
                //         labels: ["Tempo Determinato", "Tempo Indeterminato"],
                //         datasets: [{
                //             label: "Costi",
                //             backgroundColor: "rgba(2,117,216,1)",
                //             borderColor: "rgba(2,117,216,1)",
                //             data: [obj.data[0].costi, obj.data[1].costi],
                //         }],
                //     },
                //     options: {
                //         scales: {
                //             xAxes: [{
                //                 time: {
                //                     unit: 'month'
                //                 },
                //                 gridLines: {
                //                     display: false
                //                 },
                //                 ticks: {
                //                     maxTicksLimit: 6
                //                 }
                //             }],
                //             yAxes: [{
                //                 ticks: {
                //                     min: 0,
                //                     max: 50000,
                //                     maxTicksLimit: 5
                //                 },
                //                 gridLines: {
                //                     display: true
                //                 }
                //             }],
                //         },
                //         legend: {
                //             display: false
                //         }
                //     }
                // });





            }

        }
    }
    httpc.send(params);
}


// function getProjects(){
//     params = "cmd=getTableJoin&table=progetti&join_field=id_responsabile&join_table=persone&join_show=nome,cognome";
//     console.log(params)
//     serverRequest(params, function(obj){
//         console.log("projects", obj);
//         projects.createTable(obj.data);

//         obj = obj.data;
//         var pie = {
//             labels:[],
//             datasets:[{
//                 data: [],
//                 backgroundColor:[]
//             }
//         ]
//         };

//         for(i =0 ; i<obj.length; i++){
//             pie.labels.push(obj[i].ACRONIMO);
//             pie.datasets[0].data.push(obj[i].COSTO);
//             pie.datasets[0].backgroundColor.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');

//         }

//             // -- Pie Chart Example
//             var ctx = document.getElementById("myPieChart");
//             var myPieChart = new Chart(ctx, {
//             type: 'pie',
//             data: pie
//             });

//             setInterval(function(){ pie.datasets[0].data[0] = Math.floor(Math.random() * 1000000); 

//                 myPieChart.update();

//             }, 3000);
//     })

// }




mytable.loadPersons = function () {
    var params = "";
    var httpc = new XMLHttpRequest(); // simplified for clarity
    var url = "crs4/persons.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send(params);

    httpc.onreadystatechange = function () { //Call a function when the state changes.
        if (httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            var obj = JSON.parse(httpc.responseText);

            mytable.persons = obj.data;
            for (i = 0; i < obj.data.length; i++) {
                var option = document.createElement("option");
                mytable.select.appendChild(option);
                option.innerHTML = obj.data[i].nome + " " + obj.data[i].cognome;
                option.value = [i];
            }

        }
    }

}




