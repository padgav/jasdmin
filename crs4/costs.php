<?php

include 'dbconfig.php';
$out = array();
$VARS = array_merge($_POST, $_GET);
error_reporting(E_ERROR | E_PARSE);

session_start();


$id = $VARS["idproject"];
$sql = "select sum(ore) as ore, contratto, sum(preventivi.ore*costi.costo) as costi from preventivi, persone, costi  where id_progetti=$idproject  and preventivi.id_persone=persone.id   and costi.id_persone=preventivi.id_persone and costi.mese =preventivi.mese and costi.anno=preventivi.anno  group by persone.contratto";

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


    $data = array();
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
    }
    else{
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $out["data"] = $data;
        $out["status"]["code"] = 100;
    }
    print json_encode($out); 

?>