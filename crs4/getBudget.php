<?php


include 'dbconfig.php';
$id=$_POST["id"];
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT ID, ACRONIMO, CDC, COSTO, START, END from progetti  where id = '$id'";
//print $sql;
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $PID = $row["ID"];
    $start = $row["START"];
    $end = $row["END"];
    
    
    $d1 = new DateTime($start);
    $d2 = new DateTime($end);

   $m1 = $d1->format('m');
   $y1 = $d1->format('Y');

    $m2 = $d2->format('m'); 
    $y2 = $d2->format('Y');
    
    $durata = $m2 - $m1 + 1 + ($y2 - $y1) * 12;

}
$out = array();
$out['id_progetto'] = $PID;
$out["start"] = $d1;
$out["end"] = $d2;

$out['id_progetto'] = $PID;
$out['years'] = array();
for($i = $y1; $i <= $y2; $i++){
    $out['years'][] = $i;
}

//query persone che lavorano al progetto
$sql =  "select distinct id_persone, persone.nome, persone.cognome  from preventivi, persone where preventivi.id_persone=persone.id and preventivi.id_progetti=$PID";

$result = $conn->query($sql);
$persons = array();
while($r = $result->fetch_assoc()) {
    $persons[] = $r;
}
$out['persons'] = $persons;


//query timecard

$sql = "SELECT  ID as PID, id_persone, id_progetti, anno, mese, ore from timecard where ID_PROGETTI = '$PID'  ";

$result = $conn->query($sql);
$timecard =array();
    while($r = $result->fetch_assoc()) {
        $timecard[] = $r;
    }


//query preventivi
$sql = "SELECT  preventivi.ID as PID, preventivi.id_persone, preventivi.id_progetti, preventivi.anno, preventivi.mese, preventivi.ore from preventivi where preventivi.ID_PROGETTI = '$PID'  ";

$result = $conn->query($sql);
$data =array();
    while($r = $result->fetch_assoc()) {
        $data[] = $r;
    }




$out['data'] = $data;
$out['timecard'] = $timecard;
    print json_encode($out); 



$conn->close();
?>