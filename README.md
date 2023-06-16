# Descripción general del proyecto

## Descripción

Diseño y construcción de un sistema web mobile first para el Servicio Agrícola y Ganadero de Chile, considerando el manejo actual de la información y modelo de negocio.

## Objetivo y propósito

Esta aplicación abarca durante todo el ciclo de vida del proceso de muestreo de la campaña de la mosca de la fruta, lo cual ante un foco larvario, el equipo de trabajo debe realizar acciones constantes y rápidas para asegurar que el foco larvario no se expanda a otros árboles frutales. Por ende la aplicación web, acortará el tiempo de ejecución y disminuirá errores humanos. La aplicación otorgará información precisa y rápida en tiempo real para el proceso de muestreo. Además la aplicación facilitará la asignación de trabajadores para cada manzana dentro del foco larvario, para que el equipo una vez ya dentro de esta aplicación, sepan inmediatamente qué tarea ejercer. 

# Dependencias

Requiere Windows 10 u 11

# Manual de instalación

## Descarga y preparación del gestor de base de datos

1. Descargar XAMPP en el sitio oficial https://www.apachefriends.org/index.html

![DOWNLOAD](https://wdb24.com/wp-content/uploads/2014/12/download-xampp-windows.png)

2. Instalar XAMPP
    + Seleccionar MySQL y phpMyAdmin

![INSTALLER](https://docs.cs-cart.com/latest/_images/step7.png)

3. Abrir panel de control de XAMPP

4. Iniciar MySQL y Apache

![START](https://wpblogx.com/wp-content/uploads/2017/12/XAMPP-control-panel-start-Apache-and-mysql.jpg)

## Configuración del entorno

Dentro de la raíz del proyecto iniciar cmd y ejecutar los siguientes comandos:

+ ### Instalar dependencias

```
npm i
```
+ ### Crear y poblar base de datos

```
npm run setup
```

## Configurar variables de entorno

Las variables de entorno están definidas en el archivo .env.sample, estas se deben configurar según los comentarios dentro de este archivo, en un nuevo archivo .env

## Creación de carpeta para evidencias

Para guardar las evidencias de los registros de especie de árbol es necesario crear la carpeta evidence dentro de data, quedando de la siguiente forma: data\evidence 

# Autores

+ Cristóbal Guillermo Núñez Weber
+ Marco Ignacio Solís Avello
+ Jhon Henry Valenzuela Vera