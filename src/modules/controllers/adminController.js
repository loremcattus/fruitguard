import models from '../models/index.js';

export const getLoginAdmin = async (req, res) => {
  const fileHTML = 'admin-login';
  const title = 'Iniciar Sesión Administrador';
  return res.render('not-logged.html', { fileHTML, title });
}

export const getAdmin = async (req, res) => {
  const fileHTML = 'admin-home';
  const title = 'Administrador';
  return res.render('not-logged.html', { fileHTML, title });
}

