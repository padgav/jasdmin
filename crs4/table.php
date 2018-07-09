<?php
include 'dbconfig.php';
$out = array();
$VARS = array_merge($_POST, $_GET);
error_reporting(E_ERROR | E_PARSE);

session_start();



$cmd = $VARS["cmd"];



if($cmd == "logout"){
    session_destroy();
    $out["status"]["code"] = 105;
    
    echo json_encode($out);
    exit(0);
}

if($cmd == "getUserInfo"){
    if(isset($_SESSION["uidnumber"])){
        $out["status"]["code"] = 101;
        $out["data"]["uidnumber"] =  $_SESSION["uidnumber"];
        $out["data"]["cn"] =  $_SESSION["cn"];
    }
    else{
        $out["status"]["code"] = 102;
    }
    echo json_encode($out);
    exit(0);

}


if($cmd == "login"){
    $user = $VARS["username"];
    $password = $VARS["password"];
    $ds=ldap_connect("ldapcluster.crs4.it");
    ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);
    if(ldap_bind($ds, "uid=$user,ou=People,dc=crs4", $password)){
        $result = ldap_search($ds,"uid=$user, ou=People,dc=crs4", "(cn=*)") or die ("Error in search query: ".ldap_error($ldapconn));
        $data = ldap_get_entries($ds, $result);
        //echo json_encode($data);
        $out["status"]["code"] = 101;
        $out["status"]["message"] = "Login Successful";
        $_SESSION["cn"] = $data[0]["cn"][0];
        $_SESSION["uidnumber"] = $data[0]["uidnumber"][0];

        $out["data"]["uidnumber"] =  $_SESSION["uidnumber"];
        $out["data"]["cn"] =  $_SESSION["cn"];
        $out["data"]["ldpap"] = $data ;
        echo json_encode($out);
        exit(0);
    }
    else{
        $out["status"]["code"] = 102;
        $out["status"]["message"] = "Login Error";
        echo json_encode($out);
        exit(0);
    }
}


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



if($cmd == "getTable"){
    $table = $VARS["table"];
    $sql = "select * from $table";
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
}
elseif($cmd =="getTableJoin"){
    $table = $VARS["table"];
    $join_field = $VARS["join_field"];
    $join_table = $VARS["join_table"];
    $join_show = $VARS["join_show"];

    $sql = "select $table.* ,  $join_show from $table, $join_table where $table.$join_field = $join_table.id ";
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

}
elseif($cmd == "update"){
    $table = $VARS["table"];
    $field = $VARS["field"];
    $value = $VARS["value"];
    $id = $VARS["id"];
    $sql = "update  $table set $field = '$value' where id = $id";
    if ($conn->query($sql) === TRUE) {
            $out["status"]["message"]= "OK";
            $out["status"]["code"]= "100";
    } else {
        $out["status"]["message"] = "Error updating record: " . $conn->error;
        $out["status"]["code"]= "9003";
    }
    print json_encode($out); 
}
elseif($cmd == "select"){
    $table = $VARS["table"];
    $field = $VARS["field"];
    $value = $VARS["value"];
    $sql = "select * from $table where $field = '$value'";   
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
}

elseif($cmd == "insert"){
    $table = $VARS["table"];
    $field = $VARS["field"];
    $value = $VARS["value"];

    //TO DO verificare che size $field == size $value
    $sql = "insert into $table  (";
    $comma = "";
    foreach ($field as $f){
        $sql .= $comma;
        $sql .= $f;
        $comma = ", ";
    }
    $sql .= ") values(";
    $comma = "";
    foreach ($value as $v){
        $sql .= $comma;
        $sql .= "'$v'";
        $comma = ", ";
    }
    $sql .= ")";

    if ($conn->query($sql) === TRUE) {
        $out["status"]["message"]= "OK";
        $out["status"]["code"]= "100";
    }  else {
        $out["status"]["message"] = "Error inserting record: " . $conn->error;
        $out["status"]["code"]= "9004";
    }
    print json_encode($out); 

    
}

elseif($cmd == "addRow"){
    $table = $VARS["table"];
    $field = $VARS["field"];
    $value = $VARS["value"];

    $sql = "insert into $table ($field) values ('$value')";
    if ($conn->query($sql) === TRUE) {
            $out["status"]["message"]= "OK";
            $out["status"]["code"]= "100";
    } else {
        $out["status"]["message"] = "Error inserting record: " . $conn->error;
        $out["status"]["code"]= "9004";
    }
    print json_encode($out); 
}

elseif($cmd == "delete"){
    $table = $VARS["table"];
    $value = $VARS["value"];
    $sql = "delete from $table where id = '$value'";
    if ($conn->query($sql) === TRUE) {
        $out["status"]["message"]= "OK";
        $out["status"]["code"]= "100";
    } else {
        $out["status"]["message"] = "Error inserting record: " . $conn->error;
        $out["status"]["code"]= "9004";
    }
    print json_encode($out); 

}

elseif($cmd == "autocomplete"){
    $table = $VARS["table"];
    $field = $VARS["field"];
    $sql = "select  $field as label from $table" ;
    $result = $conn->query($sql);
    $data = array();
    if($result === FALSE) {
        //$out["status"]["code"] = 9001;
    }
    else{
        while($row = $result->fetch_assoc()) {
            $data[] = $row["label"];
        }
       
        //$out["status"]["code"] = 100;
    }
    print json_encode($data); 

}


$conn->close();


?>