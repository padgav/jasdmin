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
        $ldapnumber = $data[0]["uidnumber"][0];

        $sql = "select id from persone where ldap = $ldapnumber";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $uid = $_SESSION["uid"] = $row["id"];


        //get project where user is leader
        $sql = "select id from progetti where id_responsabile = $uid";
        $result = $conn->query($sql);
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $_SESSION["projects"] = $data;

        

        $out["data"]["uidnumber"] =  $_SESSION["uidnumber"];
        $out["data"]["cn"] =  $_SESSION["cn"];
        $out["data"]["ldpap"] = $data ;


        //get user roles
        $sql = "select id_ruolo from ruser where id_persona = $uid";
        $result = $conn->query($sql);
        $roles = array();
        while($row = $result->fetch_assoc()) {
            $roles[] = $row;
        }
        $_SESSION["roles"] = $roles;

        //get groups
        $sql = "select id_groups, gruppi.nome from gusers, gruppi   where id_persona = $uid and gruppi.id = gusers.id_groups";
        $result = $conn->query($sql);
        $groups = array();
        while($row = $result->fetch_assoc()) {
            $groups[] = $row;
        }
        $_SESSION["groups"] = $groups;

        //get group where user is leader
        $sql = "select id_gruppo, gruppi.nome from cgruppi, gruppi   where id_persona = $uid and gruppi.id = cgruppi.id_gruppo";
        $result = $conn->query($sql);
        $cgroups = array();
        while($row = $result->fetch_assoc()) {
            $cgroups[] = $row;
            $parentid = $row["id_gruppo"];

            $sql = "select  id as id_gruppo, nome, parent  from    (select * from gruppi order by parent, id) products_sorted, (select @pv := '$parentid') initialisation where   find_in_set(parent , @pv)and     length(@pv := concat(@pv, ',', id))";
            $result2 = $conn->query($sql);
            while($row2 = $result2->fetch_assoc()) {
                $cgroups[] = $row2;
            }

        }
        $_SESSION["cgroups"] = $cgroups;


        $out["session"] = $_SESSION;
        echo json_encode($out);
        $conn->close();
        exit(0);
    }
    else{
        $out["status"]["code"] = 102;
        $out["status"]["message"] = "Login Error";
        echo json_encode($out);
        $conn->close();
        exit(0);
    }
}






if($cmd == "getTable"){
    $table = $VARS["table"];
    $sql = "select * from $table";
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
    $term = $VARS["term"];
    $sql = "select id as value,  CONCAT(nome, ' ', cognome)  as label from $table where nome like '%$term%' OR cognome like '%$term%'" ;
    $result = $conn->query($sql);
    $data = array();
    if($result === FALSE) {
        //$out["status"]["code"] = 9001;
    }
    else{
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
       
        //$out["status"]["code"] = 100;
    }
    print json_encode($data); 

}


$conn->close();


?>