import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;

// Construir la URL base
const baseUrl = `http://${host}:${port}`;

// INICIAR SESIÓN

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('loginPost');
const regionsSelectAdd = document.getElementById('regionAdd');
const communesSelectAdd = document.getElementById('communeAdd');
const nameInputAdd = document.getElementById('nameAdd');
const fileInputAdd = document.getElementById('file-upload');