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
$id = $VARS["projectid"];
$sql = "select mese, anno, sum(ore) as ore from preventivi where id_progetti=$id group by mese, anno order by anno, mese";

$data = array();
$result = $conn->query($sql);
if($result === FALSE) {
   
}
else{
    $out["status"]["code"] = 100;
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
     }
    $out["data"] = $data;
   
}
print json_encode($out); 
$conn->close();


?>