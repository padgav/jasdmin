function JasdminHr(tbodyid) {
    var self = this;
    this.tbodyid = tbodyid;
    params = "hr.php&cmd=getTable";
    serverRequest(params, function (obj) {
        console.log("persone", obj);
        self.createTable(obj.data);

        $('#personale').DataTable();


    }, "crs4/hr.php");
}


JasdminHr.prototype.createTable = function (obj){

    var tbody = document.getElementById(this.tbodyid);
    for(i = 0; i< obj.length; i++){
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var fields = ["NOME", "COGNOME", "CF", "DATA_NASCITA", "comune" ,"contratto", "start", "end"];
        var row = obj[i];
        for(j=0; j<fields.length; j++){
            var f = fields[j];
            var td = document.createElement("td");
            td.innerHTML = row[f];
            td.contentEditable = true;
            td.dataset.id = row.ID;
            td.dataset.field = f;
            td.addEventListener("blur", function(e){
                this.dataset.id
                this.dataset.field;
                var params = "cmd=update&field=" + this.dataset.field + "&value=" + this.innerHTML + "&id=" + this.dataset.id;
            
                serverRequest(params, function (obj) {

            }, "crs4/hr.php");



            })

            tr.appendChild(td);
        }

    }

}