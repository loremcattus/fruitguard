# Descripción general del proyecto

## Descripción

Diseño y construcción de un sistema web mobile first para el Servicio Agrícola y Ganadero de Chile, considerando el manejo actual de la información y modelo de negocio.

## Objetivo y proposito

Esta aplicación abarca durante todo el ciclo de vida del proceso de muestreo de la campaña de la mosca de la fruta, lo cual ante un foco larvario, el equipo de trabajo debe realizar acciones constantes y rápidas para asegurar que el foco larvario no se expanda a otros árboles frutales. Por ende la aplicación web, acortará el tiempo de ejecución y disminuirá errores humanos. La aplicación otorgará información precisa y rápida en tiempo real para el proceso de muestreo. Además la aplicación facilitará la asignación de trabajadores para cada manzana dentro del foco larvario, para que el equipo una vez ya dentro de esta aplicación, sepan inmediatamente que tarea ejercer. 

# Manual de instalación

## Descarga y preparación del gestor de base de datos

1. Descargar XAMPP
2. Instalar XAMPP
    + Seleccionar MySQL y phpMyAdmin
3. Abrir panel de control de XAMPP
3. Iniciar MySQL y Apache

## Configuración del entorno de desarrollo

Dentro de la raíz del proyecto iniciar cmd y ejecutar los siguientes comandos:
+ ### Instalar dependencias
```
.\node\npm i --production
```
+ ### Crear y poblar base de datos
```
.\node\npm run setup
```

# Manual de uso

## Visualizar base de datos

1. Desde el panel de control de XAMPP clickear en Admin de MySQL.
2. Seleccionar la base de datos.
3. Desde aquí podrás visualizar las distintas tablas con sus respectivos datos.

# Autores

+ Cristóbal Guillermo Núñez Weber
+ Marco Ignacio Solís Avello
+ Jhon Henry Valenzuela Vera