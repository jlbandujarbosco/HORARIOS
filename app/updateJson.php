<?php
session_start(); // Iniciar la sesión para acceder a las variables de sesión
$servername = "localhost";
$username = "ixl02005_horarios"; // Cambia esto
$password = "Femb@l8dlm"; // Cambia esto
$dbname = "ixl02005_horarios";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Lee la entrada JSON
$data = json_decode(file_get_contents('php://input'), true); // Convierte el JSON a un array PHP

if (isset($_SESSION['username']) && !empty($data)) {
    $usernameActive = $_SESSION['username']; // Usuario activo
    $jsonData = json_encode($data); // Convierte el array PHP de nuevo a JSON

    // Prepara la consulta SQL para actualizar el campo JSON del usuario activo
    $stmt = $conn->prepare("UPDATE users SET datos = ? WHERE username = ?");
    $stmt->bind_param("ss", $jsonData, $usernameActive);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Campo JSON actualizado."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar el campo JSON."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se proporcionaron datos válidos o el usuario no está autenticado."]);
}

$stmt->close();
$conn->close();
?>

