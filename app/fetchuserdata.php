<?php
session_start();

require_once 'config.php'; // Incluye la configuración

$conn = new mysqli($servername, $username, $password, $dbname);


// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if(isset($_SESSION['username'])) {
    $user = $_SESSION['username'];
    
    $stmt = $conn->prepare("SELECT centro, datos FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($centro, $datos);
    $stmt->fetch();
    
    // Preparar un arreglo para la respuesta
    $response = [
        "centro" => $centro,
        "datos" => json_decode($datos) // Decodifica JSON a objeto PHP
    ];

    echo json_encode($response); // Devuelve como JSON
}

$conn->close();
