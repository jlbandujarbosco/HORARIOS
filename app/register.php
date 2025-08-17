<?php
require_once 'config.php'; // Incluye la configuración

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Maneja el registro del usuario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];
    $centro = $_POST['centro'];
    $departamento = $_POST['departamento'];

    // Verifica si el usuario ya existe
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "El usuario ya existe. Elige otro nombre de usuario.";
    } else {
        // Si el usuario no existe, haseamos la contraseña y lo registramos
        $hashed_password = password_hash($pass, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (username, password, centro, departamento) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $user, $hashed_password, $centro, $departamento);

        if ($stmt->execute()) {
            echo "Registro exitoso. Puedes iniciar sesión ahora: <a href='index.html'>Hacer Login</a>";
        } else {
            echo "Error en el registro: " . $stmt->error;
        }
    }

    $stmt->close();
}

$conn->close();
?>
