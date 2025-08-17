<?php
require_once 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $clave_lectura = isset($_POST['clave_lectura']) ? trim($_POST['clave_lectura']) : '';

    // Busca usuario con esa clave de solo lectura
    $sql = "SELECT username FROM users WHERE clave_lectura = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $clave_lectura);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        session_start();
        $_SESSION['username'] = $row['username'];
        $_SESSION['readonly'] = true;
        header("Location: panel.php");
        exit();
    } else {
        echo "Clave de solo lectura incorrecta.";
    }
    $stmt->close();
}

$conn->close();