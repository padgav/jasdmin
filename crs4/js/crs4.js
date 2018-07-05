
function serverRequest(params, callback, url = "crs4/table.php"){
    var httpc = new XMLHttpRequest(); // simplified for clarity
    //var url = "crs4/table.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            
            var obj= JSON.parse(httpc.responseText);
            callback(obj);
        }
    }
    httpc.send(params);

}


function logout(){

    params = "cmd=logout";
    serverRequest(params, function(obj){
        console.log(obj);
            if(obj.status.code==105){
                location.reload();
            }
    })
}
var uidnumber;

function init(){

    params = "cmd=getUserInfo";
    serverRequest(params, function(obj){

        console.log(obj);
        if(obj.status.code == 102) $("#crs4loginform").show();
        if(obj.status.code == 101) {
            $("#crs4maincontainer").show();
            $("#crs4loginform").hide();
            $("#crs4userinfo").html(obj.data.cn);

            uidnumber  = obj.data.uidnumber;
            getProjects();
            getBudget(8070);
            $('#dataTable').DataTable();
            $('#dataTable2').DataTable();
        }

    })
  
    document.getElementById("crs4notesbutton").addEventListener("click", function(e){
        var text = document.getElementById("crs4notestext").value;
        var userid = uidnumber;
        var projectid = $("#crs4notestext").data("projectid");
        document.getElementById("crs4notestext").value = "";
        
        var params = "cmd=insert&table=notes&field[]=id_persona&field[]=id_progetto&field[]=testo&value[]=" + userid  + "&value[]=" +  projectid + "&value[]=" + text;
        serverRequest(params, function(obj){

            getNotes(projectid);

        })
    })


    document.getElementById("crs4login").addEventListener("click", function(e){

        var username = document.getElementById("crs4username").value;
        var password = document.getElementById("crs4password").value;

        params = "cmd=login&username=" + username + "&password=" + password;
        serverRequest(params, function(obj){
            console.log(obj);
            if(obj.status.code == 102) {
                $("#crs4loginform").show();
                alert("Login Incorrect");
            }
            if(obj.status.code == 101) {
                $("#crs4maincontainer").show();
                $("#crs4loginform").hide();
                $("#crs4userinfo").html(obj.data.cn);
                getProjects();
                getBudget(8070);
            }

        })
    })   
}


serialize = function(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

function aggiornaore(ore, obj) {
console.log("obj", obj)
    obj.oldore = obj.ore; 
    obj.ore = ore;
    var event = new CustomEvent("crs4budgetchanged", { detail: obj })
    //console.log("chiamo aggiornaore",  obj);

    params = serialize(obj);
    console.log(params);
    var httpc = new XMLHttpRequest(); // simplified for clarity
    var url = "crs4/aggiornaore.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            
            var obj= JSON.parse(httpc.responseText);
            
            document.getElementById("status").innerHTML=obj.status;
            if(obj.status!="OK"){
                document.getElementById("status").className="bg-danger";
            }
            else{
                document.getElementById("mytable").dispatchEvent(event);
                document.getElementById("status").className="bg-success";
                document.getElementById("costoprogetto").innerHTML = obj.tot;


                                                        var ctx = document.getElementById("myBarChart");
                                                        var myLineChart = new Chart(ctx, {
                                                        type: 'bar',
                                                        data: {
                                                            labels: ["Tempo Determinato", "Tempo Indeterminato"],
                                                            datasets: [{
                                                            label: "Costi",
                                                            backgroundColor: "rgba(2,117,216,1)",
                                                            borderColor: "rgba(2,117,216,1)",
                                                            data: [obj.data[0].costi, obj.data[1].costi],
                                                            }],
                                                        },
                                                        options: {
                                                            scales: {
                                                            xAxes: [{
                                                                time: {
                                                                unit: 'month'
                                                                },
                                                                gridLines: {
                                                                display: false
                                                                },
                                                                ticks: {
                                                                maxTicksLimit: 6
                                                                }
                                                            }],
                                                            yAxes: [{
                                                                ticks: {
                                                                min: 0,
                                                                max: 50000,
                                                                maxTicksLimit: 5
                                                                },
                                                                gridLines: {
                                                                display: true
                                                                }
                                                            }],
                                                            },
                                                            legend: {
                                                            display: false
                                                            }
                                                        }
                                                        });




                
            }
            
        }
    }
    httpc.send(params);
}


function getProjects(){
    params = "cmd=getTableJoin&table=progetti&join_field=id_responsabile&join_table=persone&join_show=nome,cognome";
    console.log(params)
    serverRequest(params, function(obj){
        console.log("projects", obj);
        projects.createTable(obj.data);

        obj = obj.data;
        var pie = {
            labels:[],
            datasets:[{
                data: [],
                backgroundColor:[]
            }
        ]
        };

        for(i =0 ; i<obj.length; i++){
            pie.labels.push(obj[i].ACRONIMO);
            pie.datasets[0].data.push(obj[i].COSTO);
            pie.datasets[0].backgroundColor.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
            
        }

            // -- Pie Chart Example
            var ctx = document.getElementById("myPieChart");
            var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: pie
            });

            setInterval(function(){ pie.datasets[0].data[0] = Math.floor(Math.random() * 1000000); 
            
                myPieChart.update();
            
            }, 3000);
    })

}


function getNotes(id){


    var params = "cmd=select&table=Notes&field=id_progetto&value=" + id;
    serverRequest(params, function(obj){
        console.log(obj);
        $("#crs4notesitem").parent().children().not(':first').remove("a");
        $("#crs4notestext").data("projectid", id);
        

        for(var i = 0; i < obj.data.length; i++){
            var newitem = $("#crs4notesitem").clone();
            newitem.removeAttr('id');
            var text = newitem.find("p");
            text.html(obj.data[i].TESTO);
            var date = newitem.find(".notesdate");
            date.html(obj.data[i].DATA);
            $("#crs4notesitem").after(newitem);
            newitem.show();

        }
        

    })
}

function getBudget(cdc){
    
    
    params = "cdc=" + cdc;
    var httpc = new XMLHttpRequest(); // simplified for clarity
    var url = "crs4/getBudget.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send(params);
    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            var obj= JSON.parse(httpc.responseText);
            //console.log(obj);
            mytable.createTable(obj)
            //mytable.addRow({id_persone: 28, nome: "Mario", cognome: "Locci"});
        }
    }
}

mytable = new Object();


mytable.createTable = function(conf){
    this.conf = conf;
    var rows = conf.persons.length;
    
    var div = document.getElementById("mytable");

    if(div.hasChildNodes()) div.removeChild(div.childNodes[0]);

    var content = document.createElement("div");
    div.appendChild(content);

     var table = document.createElement("table");

     
        
      
     //table.border = 1;
     table.classList.add("table");
     table.classList.add("table-striped");
     table.classList.add("table-bordered");
     table.classList.add("table-hover", "table-sm");
     
     
       
     content.appendChild(table);
     //div.replaceChild(table);


    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var th = document.createElement("th");
    tr.appendChild(th);

    for(y = 0; y < conf.years.length; y++){
        var th = document.createElement("th");
        th.colSpan = 12;
        th.appendChild(document.createTextNode(  conf.years[y]  ));
        tr.appendChild(th);

        
    }

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var th = document.createElement("th");
    tr.appendChild(th);

    for (var m = 0 ; m < 12 * conf.years.length ; m++){
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(  m % 12 +1 ));
        tr.appendChild(th);
    }


     var tbody = document.createElement("tbody");
     this.tbody = tbody;

     
     table.appendChild(tbody);

     for(i=0; i< rows; i++){
         this.addRow(conf.persons[i]);
     }


     for(i = 0; i< conf.data.length; i++){
        var idstring = conf.id_progetto + "_" + conf.data[i].id_persone + "_" + conf.data[i].anno + "_" +conf.data[i].mese;
        //console.log(idstring)
        var el = document.getElementById(idstring);
        if(el != null){
            el.innerHTML = conf.data[i].ore;
            el.dataset.ore = conf.data[i].ore;
            el.dataset['id'] = conf.data[i].PID;
        }
        
     }
    
     for(i = 0; i< conf.timecard.length; i++){
        var idstring = conf.id_progetto + "_" + conf.timecard[i].id_persone + "_" + conf.timecard[i].anno + "_" +conf.timecard[i].mese;
        //console.log(idstring)
        var el = document.getElementById(idstring);
        el.dataset["timecard"] = conf.timecard[i].ore;


        if(el.dataset["timecard"] > el.innerHTML) el.classList.add("table-danger");
        if(el.dataset["timecard"] < el.innerHTML) el.classList.add("table-success");
     }


     var select = document.createElement("select");
     this.select = select;

    
     var option = document.createElement("option");
     select.appendChild(option);
     
     option.innerHTML = "Seleziona ...";
     option.disabled = true;
     option.selected = true;
     var button = document.createElement("button");
     button.addEventListener("click", function(e){
        var id= mytable.select.value;
        

        var p = mytable.persons[id].id_persone;
        var found = false;
        //console.log("conf", mytable.conf)
        for(i=0; i< mytable.conf.persons.length; i++){
                if(p == mytable.conf.persons[i].id_persone) {
                    found = true;
                    break;
                }
        }
       if(!found) {
           mytable.addRow(mytable.persons[id]);
           mytable.conf.persons.push(mytable.persons[id]);
       }
    });
     button.innerHTML = "Aggiungi";
     button.disabled = true;
     content.appendChild(select);
     content.appendChild(button);
     select .addEventListener("change", function(e){
        button.disabled = false;
     });
     mytable.loadPersons();
    
     
}


mytable.loadPersons = function(){
    params = "";
    var httpc = new XMLHttpRequest(); // simplified for clarity
    var url = "crs4/persons.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send(params);

    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            var obj= JSON.parse(httpc.responseText);
           
            mytable.persons = obj.data;
            for(i = 0; i < obj.data.length; i++){
                var option = document.createElement("option");
                mytable.select.appendChild(option);
                option.innerHTML = obj.data[i].nome +  " " + obj.data[i].cognome;
                option.value = [i];
            }
            
        }
    }
    
}



mytable.addRow = function(persona){

    //console.log("addRow", this.tbody)
    var conf = this.conf;
    var tr = document.createElement("tr");
    mytable.tbody.appendChild(tr);
        var td = document.createElement("td");
        tr.appendChild(td);
        td.appendChild(document.createTextNode(persona.nome + " " + persona.cognome));


        for(y = 0; y < conf.years.length; y++){

            for(m=1; m <= 12; m++){

                var editable = false;
                var content = "";
            
                if(new Date(conf.start.date) < new Date(conf.years[y],   m-1 , 31)      && new Date(conf.end.date) > new Date(conf.years[y],   m-1 , 1) ) {
                    editable = true;
                    content = 0;
                }
                else{
                     editable = false;
                     content = "";
                }

                var td = document.createElement("td");
                tr.appendChild(td);
                td.id = conf.id_progetto + "_" + persona.id_persone + "_" +  conf.years[y] + "_" + m;
                td.appendChild(document.createTextNode(content));
                td.contentEditable = editable;

                td.addEventListener("keypress", function(e){
                    //.log(event.keyCode)
                    if((this.innerHTML.length === 3   || event.keyCode  < 48 || event.keyCode > 57)  && event.keyCode != 8   )  {
                        event.preventDefault();
                    }

                });

                td.addEventListener("focus", function(e) {
                    //console.log(e);
                    var range = document.createRange();
                    range.selectNodeContents(e.target);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                });
                td.dataset['prid'] = conf['id_progetto'];
                td.dataset['id_persone'] = persona.id_persone;
                td.dataset['anno'] = conf.years[y];
                td.dataset['mese'] = m;
                td.addEventListener("blur", function(e) {
                    aggiornaore(this.innerHTML, this.dataset);
                });
                
            }
        }   
}
