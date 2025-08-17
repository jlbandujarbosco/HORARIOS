<?php
session_start();


if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $actual = $_POST['actual'];
    $nueva = $_POST['nueva'];
    $confirmar = $_POST['confirmar'];
    $usuario = $_SESSION['username'];

    if ($nueva !== $confirmar) {
        echo "Las contraseñas nuevas no coinciden.";
        exit();
    }
    require_once 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Obtiene la contraseña actual
    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->bind_result($password_hash);
    $stmt->fetch();
    $stmt->close();

    // Verifica la contraseña actual
    if (!password_verify($actual, $password_hash)) {
        echo "La contraseña actual es incorrecta.";
        $conn->close();
        exit();
    }

    // Actualiza la contraseña
    $nuevo_hash = password_hash($nueva, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
    $stmt->bind_param("ss", $nuevo_hash, $usuario);
    if ($stmt->execute()) {
        echo "Contraseña cambiada correctamente. <a href='panel.php'>Volver al panel</a>";
    } else {
        echo "Error al cambiar la contraseña.";
    }
    $stmt->close();
    $conn->close();
}
?>