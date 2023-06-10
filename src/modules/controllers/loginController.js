import models from '../models/index.js';
const { User } = models;

export const getLogin = async (req, res) => {
  const fileHTML = 'login';
  const title = 'Iniciar Sesión';
  return res.render('not-logged.html', { fileHTML, title });
}

export const getRegister = async (req, res) => {
  const fileHTML = 'register';
  const title = 'Registrarse';
  return res.render('not-logged.html', { fileHTML, title });
}

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) throw new Error('El correo no se recibió correctamente');

    const user = await User.findOne({
      attributes: ['id'],
      where: { email }
    });
    if(!user) return res.sendStatus(404);

    const password = Math.random().toString(36).slice(-12);

    // 1. Enviar correo con nueva contraseña...
    // 2. Encriptar nueva contraseña

    // La actualización de la contraseña tal vez se podría realizar cuando ponga confirmar en su correo,
    // en ese caso se tendría que encriptar y actualizar con otro endpoint que reciba el string desde el correo
    await user.update({password});

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error al recuperar la contraseña: ', error);
    return res.sendStatus(500);
  }
}

export const getHome = async (req, res) => {
  const fileHTML = 'home';
  const title = 'Inicio';
  return res.render('index.html', { fileHTML, title });
};