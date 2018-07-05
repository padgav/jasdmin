<?php
include 'dbconfig.php';
error_reporting(E_ERROR | E_PARSE);

$VARS = array_merge($_POST, $_GET);
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo("Connection failed: ");// . $conn->connect_error);
    exit();
}

$id = $VARS["id"];
$ore = $VARS["ore"];
$project_id = $VARS["prid"];

$id_persone = $VARS["id_persone"];
$anno = $VARS["anno"];
$mese = $VARS["mese"];


if($id ==null){

    $sql = "INSERT INTO preventivi (ID_PERSONE, ID_PROGETTI, ANNO, MESE , ORE) VALUES ($id_persone, $project_id, $anno, $mese, $ore)";


    if ($conn->query($sql) === TRUE) {
        
        
        $sql ="select sum(preventivi.ore * costi.costo) as tot  from costi, preventivi where preventivi.id_progetti=$project_id AND (preventivi.id_persone = costi.id_persone) and(preventivi.mese=costi.mese) and (preventivi.anno = costi.anno);";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $out = array();
            $out['status'] = "OK";
            $out['tot'] = $row["tot"];
            
        }
        
        
    } else {
            $out = array();
            $out['status'] = "Error updating record: " . $conn->error;
    }


}
else{



    $sql = "UPDATE preventivi SET ore='$ore'  WHERE id=$id";


    if ($conn->query($sql) === TRUE) {
        
        
        $sql ="select sum(preventivi.ore * costi.costo) as tot  from costi, preventivi where preventivi.id_progetti=$project_id AND (preventivi.id_persone = costi.id_persone) and(preventivi.mese=costi.mese) and (preventivi.anno = costi.anno);";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $out['status'] = "OK";
            $out['tot'] = $row["tot"];
            
        }

      
        $sql = "select sum(ore) as ore, contratto, sum(preventivi.ore*costi.costo) as costi from preventivi, persone, costi  where id_progetti=$project_id  and preventivi.id_persone=persone.id   and costi.id_persone=preventivi.id_persone and costi.mese =preventivi.mese and costi.anno=preventivi.anno  group by persone.contratto";
        $data = array();
        $result = $conn->query($sql);
        if($result === FALSE) {
           
        }
        else{
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
             }
            $out["data"] = $data;
           
        }
        
    } else {
            $out = array();
            $out['status'] = "Error updating record: " . $conn->error;
    }

}

print json_encode($out);
$conn->close();
?>