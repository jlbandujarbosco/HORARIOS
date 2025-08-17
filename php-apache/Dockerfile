# Usa la imagen base de PHP y Apache
FROM php:7.4-apache

# Instala extensiones para la base de datos
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Descarga Adminer y lo coloca en el directorio web
RUN curl -o /var/www/html/adminer.php https://www.adminer.org/static/download/4.8.1/adminer-4.8.1-en.php

# Opcional: para que se pueda acceder a Adminer en la raíz del sitio
# RUN echo "<?php header('Location: adminer.php'); ?>" > /var/www/html/index.php