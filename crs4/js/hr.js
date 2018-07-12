function JasdminHr(tbodyid, input, button) {
    var self = this;
    this.tbodyid = tbodyid;
    this.input = input;
    this.button = button;
    params = "hr.php&cmd=getTable";
    serverRequest(params, function (obj) {
        console.log("persone", obj);
        self.createTable(obj.data);

        $('#personale').DataTable();


    }, "crs4/hr.php");


    document.getElementById(button).addEventListener("click", function(e){
        var cf = document.getElementById(input).value;
        var params = "cmd=new&cf=" + cf;
        serverRequest(params, function (obj) {

            document.getElementById("crs4personalestatus").innerHTML =  obj.status.code + ": " + obj.status.message;
            
        }, "crs4/hr.php");
        

    })


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
            td.dataset.oldvalue = row[f];
            td.addEventListener("blur", function(e){
                this.dataset.id
                this.dataset.field;
                var params = "cmd=update&field=" + this.dataset.field + "&value=" + this.innerHTML + "&id=" + this.dataset.id;
                var elem = this;
                serverRequest(params, function (obj) {
                    document.getElementById("crs4personalestatus").innerHTML =  obj.status.code + ": " + obj.status.message;

                    if(obj.status.code != 100) elem.innerHTML = elem.dataset.oldvalue;
            }, "crs4/hr.php");



            })

            tr.appendChild(td);
        }

    }

}