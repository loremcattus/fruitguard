import nodemailer from 'nodemailer';
import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType, validateRUT, formatDate } from '../../helpers/validators.js';
import { roles } from '../../helpers/enums.js';
import helpers from '../../lib/helpers.js';


const { User, force, Sequelize } = models;

// Define las propiedades que se van a extraer de los usuarios
const userProps = ['id', 'role', 'name', 'run', 'dvRun', 'email', 'hasLicense', 'deletedAt'];

// Formatear respuesta de un usuario
const formatUser = (user) => {
  const { id, role, name, run, dvRun, email, hasLicense } = user;
  const rut = `${run}-${dvRun}`;
  return { id, role, name, rut, email, hasLicense };
};

// Obtener todos los usuarios
export const getAdminUsers = async (req, res) => {
  const fileHTML = 'admin-list-users';
  const title = 'Administrar Usuarios';

  try {
    const { name, run, email, hasLicense, role } = req.query; // Obtener los parámetros de búsqueda de la URL
    console.log(req.query);
    // Convertir el valor de openString a booleano
    const licenseBoolean = hasLicense === true;

    // Construir el objeto de búsqueda dinámicamente
    const searchOptions = {
      ...(name && { name }),
      ...(run && { run }),
      ...(email && { email }),
      ...(hasLicense && { hasLicense: licenseBoolean }),
      ...(role && { role }),
    };
    // Obtener todos los usuarios con las propiedades definidas
    const users = await User.findAll({ 
      attributes: userProps, 
      order: [['id', 'DESC']],
      where: searchOptions,
      paranoid: false 
    });

    let formattedUsers = [];
    if (users.length > 0) {
      formattedUsers = formatDataValues(users);
    }
    // Dar formato a cada usuario y crear un nuevo array

    // Enviar el array con los usuarios formateados
    return res.render('index.html', { formattedUsers, fileHTML, title, roles });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

// Obtener un usuario por su ID
export const getAdminUser = async (req, res) => {
  const fileHTML = 'admin-view-user';
  const title = 'Ver Usuario';
  const single = true;
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar el usuario por su ID y obtener sus propiedades definidas
    const user = await User.findByPk(req.params.UserId, {
      paranoid: false 
    });

    if (user) {
      const { ...formattedUser } = user.dataValues;
      formattedUser.createdAt = formatDate(formattedUser.createdAt);
      formattedUser.updatedAt = formatDate(formattedUser.updatedAt);
      return res.render('index.html', { formattedUser, fileHTML, title, single, roles  });
    } else {
      return res.render('error.html', { error: 404 });
    }

  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};


// Agregar un usuario
export const addUser = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    const { name, rut, email, hasLicense, role } = req.body;

    const { run, dvRun } = helpers.separarRut(rut);

    const password = helpers.generatePassword();
    
    const runToInt = parseInt(run);

    const userData = {name, run: runToInt, dvRun, email, password, hasLicense, role};
    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateFieldsDataType(userData, User);

    // Comprobar errores de validación
    if (validatedObject.error) { 
      console.log(validatedObject.error);
      return res.status(400).json(validatedObject);
    }

    // Validar el RUT
    if (!validateRUT(`${run}-${dvRun}`)) {
      return res.status(400).json({ errors: `El RUT '${run}-${dvRun}' es inválido` });
    }

    // Comprobar si el rut ya existe en la base de datos
    const existingUser = await User.count({ where: { run }, paranoid: false });
    if (existingUser) {
      return res.status(409).json({ error: `El valor de run '${run}' ya está registrado` });
    }

    // Enviar credenciales a usuario
    sendCredentials(userData.name, userData.email, userData.password);

    userData.password = await helpers.encryptPassword(userData.password);

    // Crear un nuevo usuario en la base de datos y devolverlo como respuesta
    const user = await User.create(userData);

    return res.status(201).json(user.toJSON());
  } catch (error) {
    console.error('Error al insertar usuario', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};


// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json('El cuerpo de la solicitud está vacío.');
    }

    if (typeof req.body.destroyUser != 'undefined') {
      if (req.body.destroyUser) {
        await User.destroy({
          where: { id: req.params.UserId }
        });
      } else {
        await User.restore({
          where: { id: req.params.UserId }
        });
      }
      return res.sendStatus(200);
    } else {
      // Filtrar y validar el cuerpo de la solicitud
      const validatedObject = await validateFieldsDataType(req.body, User);
      
      // Comprobar errores de validación
      if (validatedObject.errors) {
        return res.status(400).json(validatedFields.errors);
      }
  
      await User.update(req.body, {
        where: {
          id: req.params.UserId
        }
      });
  
      return res.sendStatus(200);
    }

  } catch (error) {
    console.error('Error al actualizar usuario', error);
    return res.status(500).json({ error: 'Ha ocurrido un error al intentar actualizar el usuario' });
  }
};


// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    // Obtener el ID del usuario de los parámetros de la solicitud
    const { id } = req.params;

    // Intentar eliminar el usuario de la base de datos
    const deletedRows = await User.destroy({
      where: { id },
      force
    });

    // Si se eliminaron filas, devolver una respuesta de éxito 200
    if (deletedRows) {
      return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    }

    // Si no se eliminaron filas, devolver una respuesta de error 404
    return res.status(404).json({ error: 'El usuario ya fue eliminado anteriormente o no existe' });
  } catch (error) {
    console.error('Error al eliminar usuario', error);
    return res.status(500).json({ error: 'Ha ocurrido un error al intentar eliminar el usuario' });
  }
};

export const getOtherManagers = async (req, res) => {
  try {
    const { currentManagerId } = req.params;

    // Obtener todos los usuarios con las propiedades definidas
    const managers = await User.findAll({
      attributes: ['id', 'name'],
      where: {id: {[Sequelize.Op.ne]: currentManagerId}, role: roles.MANAGER }, 
    });

    // Si no existen usuarios, lanzar un error para capturarlo en el bloque catch
    if (!managers[0]) throw new Error('No hay otros managers registrados');

    const formattedManagers = [];
    for(let i = 0; i < managers.length; i++) {
      formattedManagers.push({
        id: managers[i].dataValues.id,
        name: managers[i].dataValues.name
      });
    }

    // Enviar el array con los usuarios formateados
    return res.status(200).json(formattedManagers);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error.message });
  }
}

function formatDataValues(data) {
  return data.map(item => item.dataValues);
}

function sendCredentials(name, mail, password){
  // Configuración del transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'jhon.valenzuela.vera@gmail.com',
      pass: 'qqceuznyzgzjujrs',
    },
  });

  // Detalles del correo electrónico
  const mailOptions = {
    from: 'jhon.valenzuela.vera@gmail.com',
    to: mail,
    subject: 'Credenciales Fruit Guard - Acceso a la aplicación del SAG',
    html: `
    <p>Estimado/a ` + name + `,</p>
    <p>¡Bienvenido/a a Fruit Guard! Sus credenciales de acceso a la aplicación del SAG son:</p>
    <p>Correo electrónico: ` + mail + `</p>
    <p>Contraseña: ` + password + `</p>
    <p>Inicie sesión con estas credenciales y aproveche todas las funcionalidades de la aplicación. Si necesita ayuda, contáctenos. ¡Gracias por unirse a Fruit Guard!</p>
    <p>Atentamente</p>
    <p>Equipo de Fruit Guard</p>
    <img src="cid:imagen1">
  `,
    attachments: [
      {
        filename: 'Sag-footer.jpg',
        path: 'src/resources/images/Sag-footer.jpg',
        cid: 'imagen1',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo electrónico enviado: ' + info.response);
    }
  });
}