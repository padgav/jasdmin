<?php
include 'dbconfig.php';
$out = array();
$VARS = array_merge($_POST, $_GET);
error_reporting(E_ERROR | E_PARSE);

session_start();
$uid = $_SESSION["uidnumber"];
$guid = $_SESSION["groups"][0]["id_groups"];



$cmd = $VARS["cmd"];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    $out["status"]["message"] = "Connection failed: " . $conn->connect_error;
    $out["status"]["code"] = 9000;
    print json_encode($out); 
    $conn->close();
    exit(1);
}


$myroles = implode("," , $_SESSION["roles"]);

$mytasks = array();
$sql = "select step from tasks where id_procedura=1 and id_ruolo in ($myroles)";
echo $sql;
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
    $mytasks[] = $row["step"];
}


if($cmd == "new"){

    $id_progetto = $VARS["id_progetto"];

    $sql = "insert into acquisti (id_persona, id_gruppo, id_progetto) values($uid, $guid, $id_progetto)";
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
        $out["status"]["message"] =  $conn->error;
    }
    else {
        $out["status"]["code"] = 100;
        $out["status"]["message"] = "OK";
        $sql ="select acquisti.*, progetti.acronimo , progetti.cdc, persone.nome, persone.cognome , acquisti.costo*acquisti.quantita as tot from acquisti inner join progetti on progetti.id = acquisti.id_progetto inner join persone on persone.ldap=acquisti.id_persona where acquisti.id=".$conn->insert_id;
        //$sql = "select * from acquisti where id=".$conn->insert_id;
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $out["data"] = $row;
    }

    print json_encode($out);
}

elseif($cmd == "update"){
    $id = $VARS["id"];
    $field = $VARS["field"];
    $value = $VARS["value"];



    $sql = "update acquisti set $field = '$value' where id = $id and inviata=0";
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
        $out["status"]["message"] =  $conn->error;
    }
    else {
        $out["status"]["code"] = 100;
        $out["status"]["message"] = "OK " . $conn->affected_rows;

        $sql = "select costo*quantita as totale from acquisti where id = $id";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $out["data"] = $row;


    }

    print json_encode($out);
}

elseif($cmd == "delete"){
    $id = $VARS["id"];
  
    $sql ="delete from acquisti where id = $id";
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
        $out["status"]["message"] =  $conn->error;
    }
    else {
        $out["status"]["code"] = 100;
        $out["status"]["message"] = "OK";
    }

    print json_encode($out);
}

elseif($cmd==="sum"){

    $id_progetto = $VARS["id_progetto"];
    $sql = "select sum(costo * quantita) as somma from acquisti where id_progetto=$id_progetto";
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
        $out["status"]["message"] =  $conn->error;
    }
    else {
        $out["status"]["code"] = 100;
        $out["status"]["message"] = "OK";
        $row = $result->fetch_assoc();
        $out["data"] = $row;
    }

    print json_encode($out);
   
}

elseif($cmd==="selectAll"){

    for($i=0; $i < sizeof($mytasks); $i++){
        $task = $mytasks[$i];

        $uid = $_SESSION["uidnumber"];
        $cprojects = implode(",", $_SESSION["projects"]);
        $cgroups = implode(",", $_SESSION["cgroups"]);
        if($task == 0) $where0 = "id_persona = $uid";
        if($task == 1) $where1 = "(id_progetto IN ($cprojects) AND inviata=1)";
        if($task == 2) $where2 = "(id_progetto IN ($cgroups) and inviata=2)";
    }

    $inviata = $VARS["inviata"];
    $where = "";
    if(isset($inviata)) $where = " where $where0 OR $where1 OR $where2";



    $sql ="select acquisti.*, progetti.acronimo , progetti.cdc, persone.nome, persone.cognome , acquisti.costo*acquisti.quantita as tot from acquisti inner join progetti on progetti.id = acquisti.id_progetto inner join persone on persone.ldap=acquisti.id_persona" . $where;
    //$sql = "select * from acquisti $where";
    $data = array();
    $result = $conn->query($sql);
    
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
        $out["status"]["message"] = $conn->error;
    }
    else{
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $out["data"] = $data;
        $out["status"]["code"] = 100;
        $out["status"]["message"] = "OK";
    }
    print json_encode($out); 

    
}


                

$conn->close();


?>