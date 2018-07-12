<?php
include 'dbconfig.php';
$out = array();
$VARS = array_merge($_POST, $_GET);
error_reporting(E_ERROR | E_PARSE);

session_start();

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

$cmd = $VARS["cmd"];

if($cmd == "insert"){
    $personid = $VARS["personid"];
    $projectid = $VARS["projectid"];
    $mese = $VARS["mese"];
    $anno = $VARS["anno"];
    $giorno = $VARS["giorno"];
    $ore = $VARS["ore"];

    $sql = "insert into timecarddays (ID_PERSONE, ID_PROGETTI, ANNO, MESE, GIORNO, ORE) values ('$personid', '$projectid', '$anno', '$mese', '$giorno', '$ore')";


    $result = $conn->query($sql);
        if($result === FALSE) {
            $out["status"]["code"] = 9001;
            $out["status"]["message"] =  $conn->error;
        }
        else {
            $out["status"]["code"] = 100;
            $out["status"]["message"] = "OK";
            $last_id = $conn->insert_id;
            $out["id"]=$last_id;
        }
        print json_encode($out); 


}
elseif($cmd == "update"){
    $id = $VARS["id"];
    $ore = $VARS["ore"];

    $sql = "update timecarddays set ore = $ore where id = $id";
    echo $sql;
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

elseif($cmd == "getmonth"){
//dato id_persone  anno e mese   fornire tutte le righe con ore progetto giorno ordinate per progetto
    $personid = $VARS["personid"];
    $anno = $VARS["anno"];
    $mese = $VARS["mese"];

    $sql = "select * from timecarddays where id_persone = $personid and anno = $anno and mese =$mese order by id_progetti, giorno";
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
        $out["status"]["message"] =  $conn->error;
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

elseif($cmd == "create"){
//da usare con attenzione!!
    $m = $VARS["mese"];
    for($i=1; $i<120 ; $i++){
        $pid1 = rand( 1 , 100 );
        $pid2 = rand( 1 , 99 );
        if($pid1 == $pid2) $pid++;
        for($j=1; $j<31; $j++){

            $ore1 = rand( 1 , 8 );
            $ore2 = 8 - $ore1;

            $sql = "insert into timecarddays (ID_PERSONE, ID_PROGETTI, ANNO, MESE, GIORNO, ORE) values ($i, $pid1, 2018, $m, $j, $ore1)";
            $result = $conn->query($sql);
            //echo "$sql <br/>";

            $sql = "insert into timecarddays (ID_PERSONE, ID_PROGETTI, ANNO, MESE, GIORNO, ORE) values ($i, $pid2, 2018, $m, $j, $ore2)";
            $result = $conn->query($sql);
            //echo "$sql <br/>";

        }
        echo "finito persona $i <br/>";
    }

}


$conn->close();




?>