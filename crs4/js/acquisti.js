function JasdminAcquisti() {
    var self = this;

    this.tbody = document.getElementById("crs4acquistibody");




    params = "cmd=selectAll";
    console.log(params)
    serverRequest(params, function (obj) {
        console.log(obj);
        if (obj.status.code == "100") {
            self.createTable(obj.data);
            $("#acquisti").DataTable();


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


    for (i = 0; i < data.length; i++) {
        this.addRow(data[i]);
    }


}

JasdminAcquisti.prototype.addRow = function (row) {

    var self = this;

    var tr = document.createElement("tr");
    this.tbody.appendChild(tr);

    var td = document.createElement("td");
    td.innerHTML = row.acronimo;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = row.cdc;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = row.nome + " " + row.cognome;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = row.marca;
    tr.appendChild(td);
    if (row.inviata == 0) td.contentEditable = true;
    td.dataset.id = row.id;
    td.addEventListener("blur", function (e) {
        var value = this.innerHTML;
        var params = "cmd=update&id=" + this.dataset.id + "&field=marca&value=" + value;
        serverRequest(params, function (obj) {
            document.getElementById("crs4acquististatus").innerHTML = obj.status.message;

        }, "crs4/acquisti.php")

    })

    td = document.createElement("td");
    td.innerHTML = row.modello;
    tr.appendChild(td);
    if (row.inviata == 0) td.contentEditable = true;
    td.dataset.id = row.id;
    td.addEventListener("blur", function (e) {
        var value = this.innerHTML;
        var params = "cmd=update&id=" + this.dataset.id + "&field=modello&value=" + value;
        serverRequest(params, function (obj) {
            document.getElementById("crs4acquististatus").innerHTML = obj.status.message;

        }, "crs4/acquisti.php")

    })

    td = document.createElement("td");
    td.innerHTML = row.costo;
    tr.appendChild(td);
    if (row.inviata == 0) td.contentEditable = true;
    td.dataset.id = row.id;
    td.addEventListener("blur", function (e) {
        var value = this.innerHTML;
        var myid = this.dataset.id;
        var my = this;
        var params = "cmd=update&id=" + this.dataset.id + "&field=costo&value=" + value;

        serverRequest(params, function (obj) {
            document.getElementById("crs4acquististatus").innerHTML = obj.status.message;
            if(obj.status.code==100){
                 document.getElementById("acquisti_" + myid).innerHTML = obj.data.totale;
            }
            else{
                my.innerHTML = "";
            }

        }, "crs4/acquisti.php")

    })

    td = document.createElement("td");
    td.innerHTML = row.quantita;
    tr.appendChild(td);
    if (row.inviata == 0) td.contentEditable = true;
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

    td = document.createElement("td");
    td.innerHTML = row.tot;
    td.id = "acquisti_" + row.id;
    tr.appendChild(td);

    //Inviata
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