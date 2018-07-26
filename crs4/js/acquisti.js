var acquisticonf =

{
    role_1: [
        { name: "acronimo", mode: "view", title: "Progetto" },
        { name: "cdc", mode: "view", title: "CDC" },
        { name: "richiedente", mode: "view", title: "Richiedente" },
        { name: "marca", mode: "edit", title: "Marca" },
        { name: "modello", mode: "edit", title: "Modello" },
        { name: "prezzo", mode: "edit", title: "Prezzo" },
        { name: "quantita", mode: "edit", title: "Quantità" },
        { name: "totale", mode: "view", title: "Totale" },
        { name: "invia", mode: "edit", title: "Invia" },
    ]
};






function JasdminAcquisti() {
    var self = this;

    this.tbody = document.getElementById("crs4acquistibody");
    var role = "role_1";
    var desc = acquisticonf[role];

    this.thead = document.getElementById("crs4acquistihead");
    var tr = document.createElement("tr");
    this.thead.appendChild(tr);

    for (i = 0; i < desc.length; i++) {
        var col = desc[i];
        var th = document.createElement("th");
        th.innerHTML = col.title;
        tr.appendChild(th);
    }

    console.log("desc", desc);



    params = "cmd=selectAll";
    console.log(params)
    serverRequest(params, function (obj) {
        console.log(obj);
        if (obj.status.code == "100") {
            self.createTable(obj.data);
           


        }
        document.getElementById("crs4acquististatus").innerHTML = obj.status.message;

    }, "crs4/acquisti.php");




    $("#crs4acquistiaggiungi").autocomplete({
        source: "crs4/projects.php?cmd=autocomplete",


        minChars: 2,
        autoFill: true,
        mustMatch: false,
        delay: 0,
        cacheLength: 1,
        max: 3,
        select: function (event, ui) {
            event.preventDefault();

            // params = "cmd=update&table=progetti&field=id_responsabile&value=" + ui.item.value + "&id=" + prid;
            //$(this).val(ui.item.label);
            document.getElementById("crs4acquistiaggiungi").dataset.id = ui.item.value;
            // $("#resp" + myelement.dataset.id).prop('disabled', true);
            // serverRequest(params, function (obj) {

            //     document.getElementById("crs4projectstatus").innerHTML = obj.status.message;

            // });
        },
        focus: function (event, ui) {
            event.preventDefault();
            $(this).val(ui.item.label);
        }
    });






    document.getElementById("crs4acquistiaggiungibutton").addEventListener("click", function (e) {
        var id_progetto = document.getElementById("crs4acquistiaggiungi").dataset.id;
        params = "cmd=new&id_progetto=" + id_progetto;

        serverRequest(params, function (obj) {
            console.log(obj);
            if (obj.status.code == "100") {
                self.addRow(obj.data);
            }
            document.getElementById("crs4acquististatus").innerHTML = obj.status.message;

        }, "crs4/acquisti.php");
    })


}



JasdminAcquisti.prototype.createTable = function (data) {


    for (var k = 0; k < data.length; k++) {
        this.addRow(data[k]);
    }

    $("#acquisti").DataTable();
}

JasdminAcquisti.prototype.addRow = function (row) {

    var self = this;

    var tr = document.createElement("tr");
    this.tbody.appendChild(tr);

    var role = "role_1";
    var desc = acquisticonf[role];
   
    for (var i = 0; i < desc.length; i++) {

        var col = desc[i];
        
        if (col.name == "acronimo") {
            var td = document.createElement("td");
            td.innerHTML = row.acronimo;
            tr.appendChild(td);
        }

        if (col.name == "cdc") {
            td = document.createElement("td");
            td.innerHTML = row.cdc;
            tr.appendChild(td);
        }

        if (col.name == "richiedente") {
            td = document.createElement("td");
            td.innerHTML = row.nome + " " + row.cognome;
            tr.appendChild(td);
        }

        if (col.name == "marca") {
            td = document.createElement("td");
            td.innerHTML = row.marca;
            tr.appendChild(td);
            if (col.mode == "edit") td.contentEditable = true;
            td.dataset.id = row.id;
            td.addEventListener("blur", function (e) {
                var value = this.innerHTML;
                var params = "cmd=update&id=" + this.dataset.id + "&field=marca&value=" + value;
                serverRequest(params, function (obj) {
                    document.getElementById("crs4acquististatus").innerHTML = obj.status.message;

                }, "crs4/acquisti.php")

            })
        }

        if (col.name == "modello") {
            td = document.createElement("td");
            td.innerHTML = row.modello;
            tr.appendChild(td);
            if (col.mode == "edit") td.contentEditable = true;
            td.dataset.id = row.id;
            td.addEventListener("blur", function (e) {
                var value = this.innerHTML;
                var params = "cmd=update&id=" + this.dataset.id + "&field=modello&value=" + value;
                serverRequest(params, function (obj) {
                    document.getElementById("crs4acquististatus").innerHTML = obj.status.message;

                }, "crs4/acquisti.php")

            })
        }

        if (col.name == "prezzo") {
            td = document.createElement("td");
            td.innerHTML = row.costo;
            tr.appendChild(td);
            if (col.mode == "edit") td.contentEditable = true;
            td.dataset.id = row.id;
            td.addEventListener("blur", function (e) {
                var value = this.innerHTML;
                var myid = this.dataset.id;
                var my = this;
                var params = "cmd=update&id=" + this.dataset.id + "&field=costo&value=" + value;

                serverRequest(params, function (obj) {
                    document.getElementById("crs4acquististatus").innerHTML = obj.status.message;
                    if (obj.status.code == 100) {
                        document.getElementById("acquisti_" + myid).innerHTML = obj.data.totale;
                    }
                    else {
                        my.innerHTML = "";
                    }

                }, "crs4/acquisti.php")

            })
        }

        if (col.name == "quantita") {
            td = document.createElement("td");
            td.innerHTML = row.quantita;
            tr.appendChild(td);
            if (col.mode == "edit") td.contentEditable = true;
            td.dataset.id = row.id;
            td.addEventListener("blur", function (e) {
                var value = this.innerHTML;
                var myid = this.dataset.id;
                var params = "cmd=update&id=" + this.dataset.id + "&field=quantita&value=" + value;
                serverRequest(params, function (obj) {
                    document.getElementById("crs4acquististatus").innerHTML = obj.status.message;
                    document.getElementById("acquisti_" + myid).innerHTML = obj.data.totale;

                }, "crs4/acquisti.php")

            })
        }

        if (col.name == "totale") {
            td = document.createElement("td");
            td.innerHTML = row.tot;
            td.id = "acquisti_" + row.id;
            tr.appendChild(td);
        }

        //Inviata
        if (col.name == "invia") {
            td = document.createElement("td");
            td.dataset.id = "inviata_" + row.id;
            if (row.inviata == 1) td.innerHTML = "Inviata";
            else {

                var butt = document.createElement("button");

                butt.dataset.id = row.id;
                butt.classList.add("btn", "btn-primary", "button");
                butt.innerHTML = "Invia";
                butt.addEventListener("click", function (e) {
                    var mybutt = this;
                    var params = "cmd=update&id=" + this.dataset.id + "&field=inviata&value=" + 1;
                    serverRequest(params, function (obj) {
                        document.getElementById("crs4acquististatus").innerHTML = obj.status.message;
                        $(mybutt).hide();
                        $("[data-id=" + mybutt.dataset.id + "]").attr('contenteditable', 'false');
                        $("[data-id=inviata_" + mybutt.dataset.id + "]").html("Inviata");
                    }, "crs4/acquisti.php")

                })
                td.appendChild(butt);
            }
            tr.appendChild(td);
        }
    }

}