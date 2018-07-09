<?php
include 'dbconfig.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}




for($i = 2000; $i <9999; $i ++){
    $cdc = $i;
    $costo = $c = rand( 200000 , 800000 );
    $sql = "INSERT INTO progetti (acronimo, cdc, costo, id_responsabile) VALUES ('Acronimo', $cdc, $costo, 1)"; 

    if ($conn->query($sql) === TRUE) {
        echo "Table settori created successfully<br/>";
    } else {
        echo "Error creating table: " . $conn->error;
    }
}



/*****************************************************************************
*                                     TABELLA gruppi                          *
******************************************************************************/

$sql ="drop table if exists settori";
$conn->query($sql);
// sql to create table
$sql = "CREATE TABLE IF NOT EXISTS gruppi (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    nome varchar(255),
    acronimo varchar(255),
    parent int(6),
    type int(6),
    responsabile int(6)
    )";

if ($conn->query($sql) === TRUE) {
    echo "Table settori created successfully<br/>";
} else {
    echo "Error creating table: " . $conn->error;
}

$sql = "INSERT INTO gruppi (nome, acronimo, parent, type) VALUES 
('CRS4', 'CRS4', 0,  0),
('ICT', 'ICT', 1,  1),
('NAT', 'NAT', 2,  2)
";
if ($conn->query($sql) === TRUE) {
    echo "Insert successfully";
} else {
    echo "Error insert: " . $conn->error;
}



/*****************************************************************************
*                                     TABELLA COSTI                          *
******************************************************************************/
$sql ="drop table if exists costi";
$conn->query($sql);

// sql to create table
$sql = "CREATE TABLE IF NOT EXISTS COSTI (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
ID_PERSONE INT,
ANNO INT,
MESE INT,
COSTO DOUBLE
)";

if ($conn->query($sql) === TRUE) {
    echo "Table COSTI created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

for($i = 1 ; $i <=12; $i++){
    
    
    $c = rand( 2000 , 4000 )/100.0;
    
    $sql = "INSERT INTO COSTI (ID_PERSONE, ANNO, MESE, COSTO)
VALUES (1, 2018, $i,  $c)";
    
   if ($conn->query($sql) === TRUE) {
    echo "Insert successfully";
} else {
    echo "Error insert: " . $conn->error;
}
    
    
 $c = rand( 2000 , 4000 )/100.0;    
   $sql = "INSERT INTO COSTI (ID_PERSONE, ANNO, MESE, COSTO)
VALUES (2, 2018, $i,  $c)";
    
   if ($conn->query($sql) === TRUE) {
    echo "Insert successfully";
} else {
    echo "Error insert: " . $conn->error;
}
    
    
    $c = rand( 2000 , 4000 )/100.0;    
   $sql = "INSERT INTO COSTI (ID_PERSONE, ANNO, MESE, COSTO)
VALUES (26, 2018, $i,  $c)";
    
   if ($conn->query($sql) === TRUE) {
    echo "Insert successfully";
} else {
    echo "Error insert: " . $conn->error;
}
    
    
    $c = rand( 2000 , 4000 )/100.0;    
   $sql = "INSERT INTO COSTI (ID_PERSONE, ANNO, MESE, COSTO)
VALUES (27, 2018, $i,  $c)";
    
   if ($conn->query($sql) === TRUE) {
    echo "Insert successfully";
} else {
    echo "Error insert: " . $conn->error;
}

}


/*****************************************************************************
*                                     TABELLA TIMECARD                       *
******************************************************************************/



$sql ="drop table if exists timecard";
$conn->query($sql);

// sql to create table
$sql = "CREATE TABLE IF NOT EXISTS timecard (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
ID_PERSONE INT,
ID_PROGETTI INT,
ANNO INT,
MESE INT,
ORE INT
)";

if ($conn->query($sql) === TRUE) {
    echo "Table timecard created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

//riempiamo la tabella con alcune ore a caso per alcune persone

$id_persone = [1, 2, 26, 27];

for($j = 0; $j < sizeof($id_persone); $j++){
    for($i = 1; $i <= 12; $i++){
        $o = rand(0, 168);
        $sql = "INSERT INTO timecard (ID_PERSONE, ID_PROGETTI, ANNO, MESE, ORE) VALUES ($id_persone[$j], 1, 2018, $i,  $o)";  
        if ($conn->query($sql) === TRUE) {
            echo "Insert successfully";
            } 
            else {
                echo "Error insert: " . $conn->error;
        }
    }
}





//chiudiamo la connessione a mysql

$conn->close();



?>