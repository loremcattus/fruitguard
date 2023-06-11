import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType, validateRUT } from '../../helpers/validators.js';
import { roles } from '../../helpers/enums.js';

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
export const getUsers = async (__, res) => {
  try {
    // Obtener todos los usuarios con las propiedades definidas
    const users = await User.findAll({ attributes: userProps, paranoid: false } );

    // Si no existen usuarios, lanzar un error para capturarlo en el bloque catch
    if (!users[0]) throw new Error('No hay usuarios registrados');

    // Dar formato a cada usuario y crear un nuevo array
    const formattedUsers = users.map(formatUser);
    // Enviar el array con los usuarios formateados
    return res.status(200).json(formattedUsers);
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

// Obtener un usuario por su ID
export const getUser = async (req, res) => {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { id } = req.params;
    // Buscar el usuario por su ID y obtener sus propiedades definidas
    const user = await User.findByPk(id,{ paranoid: false });

    // Si el usuario no existe, lanzar un error para capturarlo en el bloque catch
    if (!user) throw new Error('El usuario no existe');

    // Dar formato al usuario y crear un nuevo objeto
    const formattedUser = formatUser(user);
    // Enviar el usuario formateado
    return res.json(formattedUser);
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

    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(req.body, User);
    // Comprobar errores de validación
    if (validatedObject.error) {
      return res.status(400).json(validatedObject);
    }

    // Obtener el valor del campo run y dvRun del objeto validado
    const { run, dvRun } = validatedObject;
    // Validar el RUT
    if (!validateRUT(`${run}-${dvRun}`)) {
      return res.status(400).json({ errors: `El RUT '${run}-${dvRun}' es inválido` });
    }

    // Comprobar si el rut ya existe en la base de datos
    const existingUser = await User.count({ where: { run }, paranoid: false });
    if (existingUser) {
      return res.status(409).json({ error: `El valor de run '${run}' ya está registrado` });
    }

    // Crear un nuevo usuario en la base de datos y devolverlo como respuesta
    const user = await User.create(validatedObject);
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
