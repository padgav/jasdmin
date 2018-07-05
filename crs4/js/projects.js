

projects = new Object();
projects.createTable = function(obj){
    var div = document.getElementById("projects");
    var table = document.createElement("table");
    table.id = "dataTable2";

    table.classList.add("table");
    table.classList.add("table-striped");
    table.classList.add("table-bordered");
    table.classList.add("table-hover", "table-sm");


    div.appendChild(table);
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var th = document.createElement("th");
    th.innerHTML = "Acronimo"
    tr.appendChild(th);
    
    
    var th = document.createElement("th");
    th.innerHTML = "CDC"
    tr.appendChild(th);
    
    var th = document.createElement("th");
    th.innerHTML = "Costo"
    tr.appendChild(th);

    var th = document.createElement("th");
    th.innerHTML = "Start   "
    tr.appendChild(th);

    var th = document.createElement("th");
    th.innerHTML = "End"
    tr.appendChild(th);

    var th = document.createElement("th");
    th.innerHTML = "Responsabile"
    tr.appendChild(th);

    var th = document.createElement("th");
    th.innerHTML = "Tools"
    tr.appendChild(th);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (var i = 0; i < obj.length; i++){
        var tr = document.createElement('tr');   
        var costo = obj[i].COSTO;
        tr.addEventListener("click", function(){
           getBudget(this.dataset.cdc);
           getNotes(this.dataset.id);
           var event = new CustomEvent('crs4projectselected', { detail: this.dataset.id });
           div.dispatchEvent(event);
        });

        var fields =["ACRONIMO", "CDC", "COSTO", "START", "END", "ID_RESPONSABILE"]
        for(var j=0; j < fields.length; j++){
            var td = document.createElement('td');
            if(j != 1) td.contentEditable = true;
            var field = fields[j];
            td.dataset.cdc = obj[i].CDC;
            td.dataset.id = obj[i].ID;
            td.dataset.field = field;
            
            td.addEventListener("blur", function(e){ 
                params = "cmd=update&table=progetti&field=" + this.dataset.field + "&value=" + this.innerHTML + "&id=" + this.dataset.id;
                serverRequest(params, function(obj){

                });
            })

            var text;

            if(j==3 || j==4){
                text = document.createElement("input");
                text.addEventListener("change", function(e){ 
                    params = "cmd=update&table=progetti&field=" + this.dataset.field + "&value=" + this.value + "&id=" + this.dataset.id;
                    serverRequest(params, function(obj){

                    });
                })
                text.type ="date";
                text.value = obj[i][field];
                text.dataset.cdc = obj[i].CDC;
                text.dataset.id = obj[i].ID;
                text.dataset.field = field;
            }
            else{

                if(j==5) text = document.createTextNode(obj[i].nome + " " + obj[i].cognome);
                else text = document.createTextNode(obj[i][field]);
                
                
            }
            
            td.appendChild(text);

            tr.appendChild(td);

            if(field == "COSTO"){
                td.addEventListener("keypress", function(e){
                    //console.log(event.keyCode)
                    if((this.innerHTML.length === 10   || event.keyCode  < 46 || event.keyCode > 57)  && event.keyCode != 8   )  {
                        event.preventDefault();
                    }
        
                });
                }   
         }

        tr.dataset.cdc=obj[i].CDC;
        tr.dataset.id=obj[i].ID;
        var td7 = document.createElement('td');
        var text7 = document.createElement("button");
        text7.classList.add("deleteButton");
        text7.innerHTML = "X";
       


        
        
        //total += Number(obj[i].COSTO);

        
        td7.appendChild(text7);
        tr.appendChild(td7);


        tbody.appendChild(tr);
           
        }

        
        
       
    


    var inputcdc = document.createElement("input");
    inputcdc.placeholder = "Nuovo cdc";
    div.appendChild(inputcdc);
    var button = document.createElement("button");
    button.innerHTML = "Aggiungi un progetto";
    button.addEventListener("click", function(e){
        
        

        params = "cmd=newproject&cdc=" + inputcdc.value;
            var httpc = new XMLHttpRequest(); // simplified for clarity
            var url = "crs4/getProjects.php";
            httpc.open("POST", url, true); // sending as POST

            httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpc.send(params);
            httpc.onreadystatechange = function() { //Call a function when the state changes.
                if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
                
                   
                     var obj = JSON.parse (httpc.responseText);
                     if(obj.status=="OK"){
                        var tr = document.createElement('tr'); 
                        tbody.appendChild(tr);
                        for(i = 0; i< 6; i++){
                            var td = document.createElement('td');
                            tr.appendChild(td);
                            if(i == 1 ){
                                td.innerHTML = inputcdc.value;
                            }
                            else if(i==3 || i == 4){
                                var input = document.createElement("input");
                                input.type = "date";
                                td.appendChild(input);
                                
                            }
                            else{
                                td.contentEditable = true;
                            }

                        }


                     }
                    
                }
            }



    });
    div.appendChild(button);
    $('#dataTable').DataTable();
    $('#dataTable2').DataTable();

}