function JasdminNotes(conf){
    var self = this;
    this.conf = conf;
    this.projectid ="";
    
    document.getElementById(conf.button).addEventListener("click", function(e){
        var text = document.getElementById(conf.textarea).value;
        var userid = uidnumber;
        
        document.getElementById("crs4notestext").value = "";
        
        var params = "cmd=insert&table=notes&field[]=id_persona&field[]=id_progetto&field[]=testo&value[]=" + userid  + "&value[]=" +  self.projectid + "&value[]=" + text;
        serverRequest(params, function(obj){

            self.getNotes();

        })
    })


 }


 JasdminNotes.prototype.setProject = function(projectid){
    this.projectid = projectid;
    this.getNotes();

 }

 JasdminNotes.prototype.getNotes = function(){


    var params = "cmd=select&table=Notes&field=id_progetto&value=" + this.projectid;
    var self = this;
    serverRequest(params, function(obj){
        console.log(obj);
        $("#crs4notesitem").parent().children().not(':first').remove("a");
        $("#crs4notestext").data("projectid", self.projectid);
        

        for(var i = 0; i < obj.data.length; i++){
            var newitem = $("#crs4notesitem").clone();
            newitem.removeAttr('id');
            var text = newitem.find("p");
            text.html(obj.data[i].TESTO);
            var date = newitem.find(".notesdate");

            date.html(moment(obj.data[i].DATA).fromNow())
            //date.html(obj.data[i].DATA);
            $("#crs4notesitem").after(newitem);
            newitem.show();

        }
        

    })
}