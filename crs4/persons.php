<?php


include 'dbconfig.php';
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT id as id_persone, nome, cognome from persone order by cognome";
$result = $conn->query($sql);
$data =array();
    while($r = $result->fetch_assoc()) {
        $data[] = $r;
    }




$out['data'] = $data;
print json_encode($out); 



$conn->close();
?>