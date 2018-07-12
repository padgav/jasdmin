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

if ($cmd=='getTable') {
    $sql = "SELECT * FROM `persone`";
    $data = array();
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


elseif ($cmd == "valid") {
    $date = $VARS["date"];
    $sql = "select * from persone where end >= '$date' and start <= '$date'";
    $data = array();
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
    }
    print json_encode($out); 


}

elseif ($cmd=='update') {
    $field= $VARS["field"];
    $id = $VARS["id"];
    $value = $VARS["value"];

    if($field == "CF"){
        $url = "http://webservices.dotnethell.it/codicefiscale.asmx/ControllaCodiceFiscale?CodiceFiscale=$value";
         $xml = file_get_contents($url);
        $check = new SimpleXMLElement($xml);
        if($check != "Il codice è valido!"){
            $out["status"]["code"] = 9001;
            $out["status"]["message"] = "codice fiscale non valido";
            print json_encode($out); 
            exit(1);
        }
    }

    $sql = "update persone set $field = '$value' where id=$id";
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

elseif ($cmd=="new") {
    $cf= $VARS["cf"];

    if(strlen($cf)!= 16) {
        $out["status"]["code"] = 9016;
        $out["status"]["message"] = "codice fiscale non valido:lenght";
        print json_encode($out); 
        exit(1);
        
    }

    $url = "http://webservices.dotnethell.it/codicefiscale.asmx/ControllaCodiceFiscale?CodiceFiscale=$cf";
    $xml = file_get_contents($url);
    $check = new SimpleXMLElement($xml);


    if($check == "Il codice è valido!"){
        $year = substr($cf, 6, 2);
        if($year < 15) $year = 2000+$year;
            else $year = 1900+$year;
    
    
        $month = substr($cf, 8, 1);

        $mseries ="ABCDEHLMPRST";

        $m = strpos($mseries, $month) ;
        if($m === FALSE) $m = "invalid";
        
        else $m = $m+1;
        

        $day = substr($cf, 9, 2);
        if($day >40) $day = $day - 40; 
        $birth = "$year-$m-$day"; 

        $codcom = substr($cf, 11, 4);

        $url = "http://webservices.dotnethell.it/codicefiscale.asmx/NomeComune?CodiceComune=$codcom";
        $xml = file_get_contents($url);
        $comune = new SimpleXMLElement($xml);
        //echo ($data[0]);

        $sql = "insert into persone (cf, contratto, data_nascita, comune, nome, cognome) values ('$cf', 0, '$birth', '$comune', '', '')";
        
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

    }
    else{
        $out["status"]["code"] = 9001;
        $out["status"]["message"] = "codice fiscale non valido";
    }
    
    print json_encode($out); 
}

elseif ($cmd=="delete") {
    $id = $VARS["id"];
    $sql = "delete from persone where id=$id";
    $result = $conn->query($sql);
    if($result === FALSE) {
        $out["status"]["code"] = 9001;
    }
    else {
        $out["status"]["code"] = 100;
        $out["status"]["message"] = "OK";
       
    }
    print json_encode($out); 

}

$conn->close();


?>