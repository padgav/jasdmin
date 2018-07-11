function JasdminProject(elementid) {
    var self = this;
    this.elementid = elementid;
    params = "cmd=getTableJoin&table=progetti&join_field=id_responsabile&join_table=persone&join_show=nome,cognome";
    console.log(params)
    serverRequest(params, function (obj) {
        console.log("projects", obj);
        self.createTable(obj.data);
    });
}

//  JasdminProject.prototype.getProjects = function(){


//             // obj = obj.data;
//             // var pie = {
//             //     labels:[],
//             //     datasets:[{
//             //         data: [],
//             //         backgroundColor:[]
//             //     }
//             // ]
//             // };

//             // for(i =0 ; i<obj.length; i++){
//             //     pie.labels.push(obj[i].ACRONIMO);
//             //     pie.datasets[0].data.push(obj[i].COSTO);
//             //     pie.datasets[0].backgroundColor.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');

//             // }

//             //     // -- Pie Chart Example
//             //     var ctx = document.getElementById("myPieChart");
//             //     var myPieChart = new Chart(ctx, {
//             //     type: 'pie',
//             //     data: pie
//             //     });

//             //     setInterval(function(){ pie.datasets[0].data[0] = Math.floor(Math.random() * 1000000); 

//             //         myPieChart.update();

//             //     }, 3000);
//         })

// }

JasdminProject.prototype.addRow = function (obj) {

    var self = this;
    var tr = document.createElement('tr');
    var costo = obj.COSTO;
    this.allcdc.push(obj.CDC)
    tr.addEventListener("click", function () {
        var event = new CustomEvent('crs4projectselected', { detail: this.dataset.id });
        self.div.dispatchEvent(event);
    });

    var fields = ["ACRONIMO", "CDC", "COSTO", "START", "END", "ID_RESPONSABILE"]
    for (var j = 0; j < fields.length; j++) {
        var td = document.createElement('td');
        if (j != 1 && j != 5) td.contentEditable = true;
        var field = fields[j];
        td.dataset.cdc = obj.CDC;
        td.dataset.id = obj.ID;
        td.dataset.field = field;

        td.addEventListener("blur", function (e) {

            var params = "cmd=update&table=progetti&field=" + this.dataset.field + "&value=" + this.innerHTML + "&id=" + this.dataset.id;
            var event = new CustomEvent('crs4projectsupdated', { detail: this.dataset.id });
            self.div.dispatchEvent(event);
            serverRequest(params, function (obj) {

            });
        })

        var text;

        if (j == 3 || j == 4) {
            text = document.createElement("input");
            text.addEventListener("change", function (e) {
                params = "cmd=update&table=progetti&field=" + this.dataset.field + "&value=" + this.value + "&id=" + this.dataset.id;
                var projectid = this.dataset.id;
                serverRequest(params, function (obj) {

                    var event = new CustomEvent('crs4projectsupdated', { detail: projectid });
                    self.div.dispatchEvent(event);

                });
            })
            text.type = "date";
            text.value = obj[field];
            text.dataset.cdc = obj.CDC;
            text.dataset.id = obj.ID;
            text.dataset.field = field;
        }
        else {

            if (j == 5) {
                text = document.createElement("input");
                text.value = obj.nome + " " + obj.cognome;
                text.disabled = true;
                td.id = "resp" + obj.ID;
            }

            else text = document.createTextNode(obj[field]);


        }

        td.appendChild(text);

        tr.appendChild(td);

        if (field == "COSTO") {
            td.addEventListener("keypress", function (e) {
                //console.log(event.keyCode)
                if ((this.innerHTML.length === 10 || event.keyCode < 46 || event.keyCode > 57) && event.keyCode != 8) {
                    event.preventDefault();
                }

            });
        }
    }

    tr.dataset.cdc = obj.CDC;
    tr.dataset.id = obj.ID;
    var td7 = document.createElement('td');
    var panel = document.createElement("div");
    td7.appendChild(panel);
    panel.classList.add("btn-group");

    var butt1 = document.createElement("button");
    butt1.innerHTML = "<i class='fa fa-trash'></i>";
    panel.appendChild(butt1);
    butt1.dataset.id = obj.ID;

    var butt2 = document.createElement("button");
    butt2.innerHTML = "<i class='fa fa-user'></i>";
    panel.appendChild(butt2);
    butt2.dataset.id = obj.ID;

    var butt3 = document.createElement("button");
    butt3.innerHTML = "<i class='fa fa-pencil'></i>";
    panel.appendChild(butt3);
    butt3.dataset.id = obj.ID;


    butt1.addEventListener("click", function (e) {
        params = "cmd=delete&table=progetti&value=" + this.dataset.id;
        var deleterow = this.dataset.id;
        serverRequest(params, function (obj) {
            $("tr[data-id='" + deleterow + "']").remove();
        });
        var event = new CustomEvent('crs4projectsrowdeleted', { detail: this.dataset.id });
        self.dispatchEvent(event);
    })

    butt2.addEventListener("click", function (e) {
        var url = "crs4/table.php?table=persone&cmd=autocomplete&field=nome";
        $("#resp" + this.dataset.id).autocomplete({
            source: url,
            minChars: 2,
            autoFill: true,
            mustMatch: false,
            delay: 0,
            cacheLength: 1,
            max: 3,
            select: function (event, ui) {
                event.preventDefault();
                $("#autocomplete").val(ui.item.label);
                text.innerHTML = ui.item.label;
                params = "cmd=update&table=progetti&field=id_responsabile&value=" + ui.item.value + "&id=" + butt2.dataset.id;
                var projectid = this.dataset.id;
                $("#autocomplete").detach();
                serverRequest(params, function (obj) {



                });
            },
            focus: function (event, ui) {
                event.preventDefault();
                $("#autocomplete").val(ui.item.label);

            }
        });




    })





    //total += Number(obj[i].COSTO);

    tr.appendChild(td7);
    this.tbody.appendChild(tr);
}

JasdminProject.prototype.createTable = function (obj) {
    var self = this;
    this.div = document.getElementById(this.elementid);
    var table = document.createElement("table");
    table.id = "dataTable";

    table.classList.add("table");
    table.classList.add("table-striped");
    table.classList.add("table-bordered");
    table.classList.add("table-hover", "table-sm");


    this.div.appendChild(table);
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

    this.tbody = document.createElement("tbody");
    table.appendChild(this.tbody);
    this.allcdc = new Array();
    for (var i = 0; i < obj.length; i++) {
        this.addRow(obj[i]);
    }


    // new CDC
    var inputcdc = document.createElement("input");
    var button = document.createElement("button");
    $(button).prop("disabled", true);

    inputcdc.placeholder = "Nuovo cdc";
    this.div.appendChild(inputcdc);


    inputcdc.addEventListener("keyup", function (e) {
        if (self.allcdc.includes(this.value)) {
            $(this).addClass("border-danger");
            $(this).removeClass("border-success");
            $(button).prop("disabled", true);

        }
        else {
            $(this).addClass("border-success");
            $(this).removeClass("border-danger");
            $(button).prop("disabled", false);
        }
    })



    button.innerHTML = "Aggiungi un progetto";
    button.addEventListener("click", function (e) {

        params = "cmd=newproject&cdc=" + inputcdc.value;
        serverRequest(params, function (obj) {
            if (obj.status == "OK") {
                self.addRow({ ID: obj.data.insert_id, CDC: inputcdc.value, ACRONIMO: "Nuovo" });
                self.allcdc.push(inputcdc.value);
                inputcdc.value = "";
            }

        }, "crs4/getProjects.php");
    });





    this.div.appendChild(button);
    $('#dataTable').DataTable();


}


