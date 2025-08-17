<?php
$servername = "mariadb";
$username = "admin";
$password = "1234";
$dbname = "horarios";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($pass, $row['password'])) {
            // Aquí inicias la sesión y rediriges
            session_start();
            $_SESSION['username'] = $user; // Guardas el nombre de usuario en la sesión

            // Redirige a la página de inicio o cualquier otra página
            header("Location: panel.php"); // Cambia 'welcome.php' a la página de destino
            exit(); // Asegúrate de llamar a exit después de header para evitar que se ejecute más código
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "Usuario no encontrado.";
    }
}

$conn->close();
?>

