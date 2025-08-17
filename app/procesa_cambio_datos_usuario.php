<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_SESSION['username'];
    $clave_lectura = isset($_POST['clave_lectura']) ? trim($_POST['clave_lectura']) : '';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Si se ha introducido una clave de solo lectura, la actualiza (sin hashear)
    if ($clave_lectura !== '') {
        $stmt = $conn->prepare("UPDATE users SET clave_lectura = ? WHERE username = ?");
        $stmt->bind_param("ss", $clave_lectura, $usuario);
        if ($stmt->execute()) {
            echo "Clave de solo lectura actualizada correctamente.<br>";
        } else {
            echo "Error al actualizar la clave de solo lectura.<br>";
        }
        $stmt->close();
    } else {
        // Si el campo está vacío, elimina la clave de solo lectura
        $stmt = $conn->prepare("UPDATE users SET clave_lectura = NULL WHERE username = ?");
        $stmt->bind_param("s", $usuario);
        if ($stmt->execute()) {
            echo "Clave de solo lectura eliminada.<br>";
        } else {
            echo "Error al eliminar la clave de solo lectura.<br>";
        }
        $stmt->close();
    }

    $conn->close();
    echo "<a href='cambiar_password.php'>Volver</a>";
}
?>