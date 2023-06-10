import express from 'express';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { renderFile } from 'ejs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { router } from './src/routes/index.js';
import session from 'express-session';
import { localStrategyRegister, localStrategyLogin } from './src/lib/passport.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Obtener el nombre actual del archivo y del directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener el puerto del entorno o establecerlo en 3000 por defecto
const PORT = process.env.PORT || 3000;

// Obtener la ruta a la carpeta de vistas
const VIEWS_PATH = path.join(__dirname, '/src/resources/views/layouts');

// Crear una aplicación Express
const app = express();

// Establecer el puerto y la carpeta de vistas
app.set('port', PORT);
app.set('views', VIEWS_PATH);

// Establecer el motor de HTML como EJS
app.engine('html', renderFile);
app.set('view engine', 'ejs');

// Configurar el middleware morgan para registrar las solicitudes en la consola
app.use(session({
  secret: 'mB2zXp$5s!8jKqCwE1sHd4a6#9l@7Fg3',
  resave: false,
  saveUninitialized: false,
}));

// Configurar el middleware de passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar la estrategia local de Passport
passport.use('localStrategyRegister', localStrategyRegister);
passport.use('localStrategyLogin', localStrategyLogin);

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//aceptare formatos de string
app.use(express.json());//se usaran json entre cliente y servidor


// Configurar el middleware express.urlencoded para manejar datos de formularios
app.use(express.urlencoded({ extended: false }));

// Configurar el middleware express.json para manejar datos JSON
app.use(express.json());

// Agregar el enrutador a la aplicación
app.use(router);

// Servir archivos estáticos desde la carpeta src/resources
app.use(express.static(path.join(__dirname, 'src/resources')));

// Escuchar en el puerto especificado y registrar un mensaje en la consola
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
