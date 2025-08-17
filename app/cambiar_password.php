<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

require_once 'config.php';
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$clave_lectura_actual = '';
$stmt = $conn->prepare("SELECT clave_lectura FROM users WHERE username = ?");
$stmt->bind_param("s", $_SESSION['username']);
$stmt->execute();
$stmt->bind_result($clave_lectura_actual);
$stmt->fetch();
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cambiar contraseña</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-5">
    <h2>Cambiar contraseña</h2>
    <form action="procesa_cambio_password.php" method="POST">
        <div class="form-group">
            <label for="actual">Contraseña actual:</label>
            <input type="password" class="form-control" id="actual" name="actual" required>
        </div>
        <div class="form-group">
            <label for="nueva">Nueva contraseña:</label>
            <input type="password" class="form-control" id="nueva" name="nueva" required>
        </div>
        <div class="form-group">
            <label for="confirmar">Confirmar nueva contraseña:</label>
            <input type="password" class="form-control" id="confirmar" name="confirmar" required>
        </div>
        <button type="submit" class="btn btn-primary">Cambiar contraseña</button>
        <a href="panel.php" class="btn btn-secondary">Cancelar</a>  
    </form>
    <hr>
    <h2>Actualizar datos de usuario</h2>
    <form action="procesa_cambio_datos_usuario.php" method="POST">
        <div class="form-group">
            <label for="clave_lectura">Clave solo lectura (opcional):</label>
            <input type="text" class="form-control" id="clave_lectura" name="clave_lectura"
                   value="<?php echo htmlspecialchars($clave_lectura_actual); ?>">
            <small class="form-text text-muted">
                Esta clave permite a otros usuarios ver los datos sin modificarlos.
            </small>
        </div>
        <!-- Puedes añadir aquí otros campos de usuario si lo necesitas -->
        <button type="submit" class="btn btn-info">Actualizar datos</button>
    </form>
    <a href="panel.php" class="btn btn-secondary mt-3">Cancelar</a>
</div>
</body>
</html>