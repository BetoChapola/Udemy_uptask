<?php

$conn = new mysqli('localhost', 'root', '', 'uptask'); 

// echo "<pre>";
// var_dump($conn);
// echo "</pre>";

if($conn->connect_error){
    echo $conn->connect_error;
}
// Muestra caracteres especiales desde la base de datos
$conn->set_charset('utf8');