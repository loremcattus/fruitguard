import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType, validateRUT } from '../../helpers/validators.js';

const { User } = models;

// Define las propiedades que se van a extraer de los usuarios
const userProps = ['id', 'role', 'name', 'run', 'dv_run', 'email', 'has_license'];

// Formatear respuesta de un usuario
const formatUser = (user) => {
  const { id, role, name, run, dv_run, email, has_license } = user;
  const rut = `${run}-${dv_run}`;
  return { id, role, name, rut, email, has_license };
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios con las propiedades definidas
    const users = await User.findAll({ attributes: userProps });
    // Dar formato a cada usuario y crear un nuevo array
    const formattedUsers = users.map(formatUser);
    // Enviar el array con los usuarios formateados
    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(404).send();
  }
};

// Obtener un usuario por su ID
export const getUser = async (req, res) => {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { id } = req.params;
    // Buscar el usuario por su ID y obtener sus propiedades definidas
    const user = await User.findByPk(id, { attributes: userProps });

    // Si el usuario no existe, lanzar un error para capturarlo en el bloque catch
    if (!user) throw new Error('User not found');

    // Dar formato al usuario y crear un nuevo objeto
    const formattedUser = formatUser(user);
    // Enviar el usuario formateado
    res.json(formattedUser);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};


// Agregar un usuario
export const addUser = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }
    // Validar el cuerpo de la solicitud
    const filteredObject = await validateRequestBody(req.body, User);

    // Comprobar errores de validación
    if (filteredObject.error) {
      return res.status(400).json(filteredObject);
    }

    // Obtener el valor del campo run y dv_run del objeto validado
    const { run, dv_run } = filteredObject;
    // Validar el RUT
    if (!validateRUT(`${run}-${dv_run}`)) {
      return res.status(400).json({ errors: `El RUT '${run}-${dv_run}' es inválido` });
    }

    // Comprobar si el usuario ya existe en la base de datos
    const existingUser = await User.count({ where: { run }, paranoid: false });
    if (existingUser) {
      return res.status(409).json({ error: `El valor de run '${run}' ya está registrado` });
    }

    // Crear un nuevo usuario en la base de datos y devolverlo como respuesta
    const user = await User.create(filteredObject);
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
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }
    // Obtener el ID del usuario de los parámetros de la solicitud
    const { id } = req.params;

    // Obtener los campos que se desean actualizar desde el cuerpo de la solicitud
    let fieldsToUpdate = req.body;
    // Eliminar los campos no deseados del objeto fieldsToUpdate
    const unwantedFields = ['id', 'run', 'dv_run', 'has_license', 'role', 'createdAt', 'updatedAt', 'deletedAt'];
    fieldsToUpdate = Object.keys(fieldsToUpdate)
      .filter(field => !unwantedFields.includes(field))
      .reduce((obj, field) => {
        obj[field] = fieldsToUpdate[field];
        return obj;
      }, {});

    // Validar el cuerpo de la solicitud
    const fieldsValidated = validateFieldsDataType(fieldsToUpdate, User);
    if (!fieldsValidated.success) {
      return res.status(400).json(fieldsValidated.data);
    }

    // Buscar el usuario por su ID
    const user = await User.findByPk(id);
    // Si el usuario no existe retorna 404
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el usuario con los campos recibidos en la solicitud
    await user.update(fieldsToUpdate);
    // Devolver el usuario actualizado como respuesta
    return res.status(200).json(user.toJSON());
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
      // force: true
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
