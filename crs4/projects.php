<?php
include 'dbconfig.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$VARS = array_merge($_POST, $_GET);
$cmd = $VARS["cmd"];

if($cmd == "update"){

    $field = $_POST["field"];
    $value = $_POST["value"];
    $cdc = $_POST["cdc"];
    $sql = "update  Progetti set $field = '$value' where cdc = $cdc";
    if ($conn->query($sql) === TRUE) {
            $out = array();
            $out['status'] = "OK";
    } else {
        $out = array();
        $out['status'] = "Error updating record: " . $conn->error;
    }


}
else if($cmd == "delete"){
    $cdc = $_POST["cdc"];
    $sql = "delete  from  Progetti where cdc = $cdc";
    $out = array();
    if ($conn->query($sql) === TRUE) {
        $out['status'] = "OK";
    } else {
        $out['status'] = "Error delete  project: " . $conn->error;
    
    }
}


else if($cmd == "autocomplete"){
    $term  = $VARS["term"];
    
    $sql = "select  concat(cdc, ' ', acronimo) as label , id as value from progetti where cdc like '$term%' or acronimo like '$term%'";
    $result = $conn->query($sql);
    $out=array();
    while($r = $result->fetch_assoc()) {
        $out[] = $r;
    }


}

else if($cmd == "newproject"){
    $cdc = $_POST["cdc"];
    $sql = "insert into  Progetti (cdc) values( $cdc)";
    $out = array();
    if ($conn->query($sql) === TRUE) {
        $out['status']["message"] = "OK";
        $out['status']["code"] = 100;
        $out['data']['insert_id'] = $conn->insert_id;
    } else {
        $out['status']["message"] = "Error insert new project: " . $conn->error;
        $out['status']["code"] = 9000;
    }

}
else{

    $out = $_POST["out"];

    $sql = "SELECT Progetti.*, Persone.nome, Persone.cognome from Progetti, Persone where  persone.id = progetti.id_responsabile order by cdc";
    $result = $conn->query($sql);

    if($out=="html"){
        echo "<table border=1 class='hoverTable'>\n";
        echo "<tr><td>ACRONIMO</td><td>CDC</td><td>COSTO</td><td>START</td><td>END</td></tr>\n";
        
        while($row = $result->fetch_assoc()) {

            echo "<tr><td>" . $row["ACRONIMO"] . "</td><td>".  $row["CDC"]   ."</td><td>  ". $row["COSTO"]   . "</td><td>". $row["START"]   ."</td><td>". $row["END"] ."</td></tr>\n";

        }
        echo "</table>\n";
    }


    elseif($out=="json"){
        $out = array();
    while($r = $result->fetch_assoc()) {
        $out[] = $r;
    }
}

    
}
print json_encode($out); 
$conn->close();

?>