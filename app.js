import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { renderFile } from 'ejs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { router } from './src/routes/index.js';

dotenv.config(); // Cargar variables de entorno de archivo .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000; // Obtener el puerto del sistema operativo o establecer 3000 como predeterminado
const VIEWS_PATH = path.join(__dirname, '/src/resources/views/layouts'); // Ruta para la carpeta de vistas

const app = express()
  .set('port', PORT) // Configuración de la aplicación
  .engine('html', renderFile)
  .set('views', VIEWS_PATH)
  .use(morgan('dev')) // Middleware para registrar solicitudes de entrada en la consola
  .use(express.urlencoded({ extended: false })) // Middleware para manejar datos de formularios
  .use(express.json()) // Middleware para manejar datos JSON
  .use(router) // Agregar rutas
  .use(express.static(path.join(__dirname, 'src/resources'))) // Middleware para servir archivos estáticos
  .listen(PORT, () => { // Iniciar el servidor
    console.log(`Server on port ${PORT}`); // Mostrar un mensaje en la consola
  });
