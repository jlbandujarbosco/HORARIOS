<?php
session_start(); // Inicia la sesión para poder destruirla
session_unset(); // Destruye todas las variables de sesión
session_destroy(); // Destruye la sesión

// Redirige al login después de cerrar la sesión
header("Location: index.html");
exit(); // Asegúrate de llamar a exit después de header
?>
