function JasdminBudget(elementid) {
    this.elementid = elementid;
    var self = this;

}

JasdminBudget.prototype.setProject = function (projectid) {
    this.projectid = projectid;
    this.getBudget();
}


JasdminBudget.prototype.getBudget = function () {

    var self = this;
    params = "id=" + this.projectid;
    var httpc = new XMLHttpRequest(); // simplified for clarity
    var url = "crs4/getBudget.php";
    httpc.open("POST", url, true); // sending as POST

    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send(params);
    httpc.onreadystatechange = function () { //Call a function when the state changes.
        if (httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            var obj = JSON.parse(httpc.responseText);
            //console.log(obj);
            self.createTable(obj)
        }
    }
}



JasdminBudget.prototype.createTable = function (conf) {
    this.conf = conf;
    var rows = conf.persons.length;
    var self = this;

    var div = document.getElementById(this.elementid);

    if (div.hasChildNodes()) div.removeChild(div.childNodes[0]);

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

    for (y = 0; y < conf.years.length; y++) {
        var th = document.createElement("th");
        th.colSpan = 12;
        th.appendChild(document.createTextNode(conf.years[y]));
        tr.appendChild(th);


    }

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var th = document.createElement("th");
    tr.appendChild(th);

    for (var m = 0; m < 12 * conf.years.length; m++) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(m % 12 + 1));
        tr.appendChild(th);
    }


    var tbody = document.createElement("tbody");
    this.tbody = tbody;


    table.appendChild(tbody);

    for (i = 0; i < rows; i++) {
        this.addRow(conf.persons[i]);
    }


    for (i = 0; i < conf.data.length; i++) {
        var idstring = conf.id_progetto + "_" + conf.data[i].id_persone + "_" + conf.data[i].anno + "_" + conf.data[i].mese;
        //console.log(idstring)
        var el = document.getElementById(idstring);
        if (el != null) {
            el.innerHTML = conf.data[i].ore;
            el.dataset.ore = conf.data[i].ore;
            el.dataset['id'] = conf.data[i].PID;
        }

    }

    for (i = 0; i < conf.timecard.length; i++) {
        var idstring = conf.id_progetto + "_" + conf.timecard[i].id_persone + "_" + conf.timecard[i].anno + "_" + conf.timecard[i].mese;
        //console.log(idstring)
        var el = document.getElementById(idstring);
        el.dataset["timecard"] = conf.timecard[i].ore;


        if (el.dataset["timecard"] > el.innerHTML) el.classList.add("table-danger");
        if (el.dataset["timecard"] < el.innerHTML) el.classList.add("table-success");
    }


    var input = document.createElement("input");
    input.id = "crs4budgetaddperoson";
    input.placeholder = "Aggiungi persone";
    content.appendChild(input);
    var url = "crs4/table.php?table=persone&cmd=autocomplete&field=nome";
    $(input).autocomplete({
        source: url,
        minChars: 2,
        autoFill: true,
        mustMatch: false,
        delay: 0,
        cacheLength: 1,
        max: 3,
        select: function (event, ui) {
            event.preventDefault();

            //alert(ui.item.value);
            console.log("conf", self.conf);
            var found = false;
            for (i = 0; i < self.conf.persons.length; i++) {
                if (ui.item.value == self.conf.persons[i].id_persone) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                self.addRow({ id_persone: ui.item.value, nome: ui.item.label, cognome: "" });
                self.conf.persons.push({id_persone: ui.item.value});
            }




            


            // params = "cmd=update&table=progetti&field=id_responsabile&value=" + ui.item.value + "&id=" + prid;
            // $(this).val(ui.item.label);
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


    //  var select = document.createElement("select");
    //  this.select = select;


    //  var option = document.createElement("option");
    //  select.appendChild(option);

    //  option.innerHTML = "Seleziona ...";
    //  option.disabled = true;
    //  option.selected = true;
    //  var button = document.createElement("button");
    //  button.addEventListener("click", function(e){
    //     var id= mytable.select.value;


    //     var p = mytable.persons[id].id_persone;
    //     var found = false;
    //     //console.log("conf", mytable.conf)
    //     for(i=0; i< mytable.conf.persons.length; i++){
    //             if(p == mytable.conf.persons[i].id_persone) {
    //                 found = true;
    //                 break;
    //             }
    //     }
    //    if(!found) {
    //        mytable.addRow(mytable.persons[id]);
    //        mytable.conf.persons.push(mytable.persons[id]);
    //    }
    // });
    //  button.innerHTML = "Aggiungi";
    //  button.disabled = true;
    //  content.appendChild(select);
    //  content.appendChild(button);
    //  select .addEventListener("change", function(e){
    //     button.disabled = false;
    //  });
    //  mytable.loadPersons();


}

JasdminBudget.prototype.addRow = function (persona) {

    //console.log("addRow", this.tbody)
    var conf = this.conf;
    var tr = document.createElement("tr");
    this.tbody.appendChild(tr);
    var td = document.createElement("td");
    tr.appendChild(td);
    td.appendChild(document.createTextNode(persona.nome + " " + persona.cognome));


    for (y = 0; y < conf.years.length; y++) {

        for (m = 1; m <= 12; m++) {

            var editable = false;
            var content = "";

            if (new Date(conf.start.date) < new Date(conf.years[y], m - 1, 31) && new Date(conf.end.date) > new Date(conf.years[y], m - 1, 1)) {
                editable = true;
                content = 0;
            }
            else {
                editable = false;
                content = "";
            }

            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = conf.id_progetto + "_" + persona.id_persone + "_" + conf.years[y] + "_" + m;
            td.appendChild(document.createTextNode(content));
            td.contentEditable = editable;

            td.addEventListener("keypress", function (e) {
                //.log(event.keyCode)
                if ((this.innerHTML.length === 3 || event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 8) {
                    event.preventDefault();
                }

            });

            td.addEventListener("focus", function (e) {
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
            td.addEventListener("blur", function (e) {
                aggiornaore(this.innerHTML, this.dataset);
            });

        }
    }
}