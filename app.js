import express from 'express';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { renderFile } from 'ejs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import multer from 'multer';
import sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import { router } from './src/routes/index.js';
import { localStrategyRegister, localStrategyLogin, localStrategyLoginAdmin } from './src/lib/passport.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Obtener el nombre actual del archivo y del directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener el puerto del entorno o establecerlo en 3000 por defecto
const PORT = process.env.PORT || 3000;

// Obtener la ruta a la carpeta de vistas
const VIEWS_PATH = path.join(__dirname, '/src/resources/views/layouts');
const EVIDENCE_PATH = path.join(__dirname, 'data', 'evidence');

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
passport.use('localStrategyLoginAdmin', localStrategyLoginAdmin);

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
// Servir archivos estáticos desde la carpeta "evidence"
app.use('/evidence', express.static(EVIDENCE_PATH));

// Evidencias
const upload = multer({
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    if (isImage) {
      cb(null, true);
    } else {
      cb(new Error('¡Archivo no válido! Debe ser una imagen.'));
    }
  }
});

app.post('/evidences/:id', upload.single('evidence'), async (req, res) => {
  try {
    const id = req.params.id;
    const outputPath = `${EVIDENCE_PATH}/${id}.webp`;

    const transform = sharp().webp({ quality: 70 });

    const buffer = await sharp(req.file.buffer)
      .pipe(transform)
      .toBuffer();

    await fsPromises.writeFile(outputPath, buffer);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send('Error al procesar la imagen: ' + error.message);
  }
});

// Escuchar en el puerto especificado y registrar un mensaje en la consola
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
