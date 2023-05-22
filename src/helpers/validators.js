import moment from 'moment';
import 'moment/locale/es.js';
import 'moment-timezone';

// Un objeto que mapea los tipos de datos de Sequelize a tipos de datos más genéricos
const dataTypeMap = {
  INTEGER: 'integer',
  STRING: 'string',
  CHAR: 'char',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ENUM: 'enum',
};

// Una función que recibe un tipo de dato de Sequelize y lo mapea a un tipo de datos más genérico
const mapSequelizeTypeToDataType = sequelizeType => {
  const { key } = sequelizeType.constructor;
  return dataTypeMap[key] ? dataTypeMap[key] : null;
};

// Un array de nombres de campos que se excluyen de la validación
const excludedFields = ['id', 'createdAt', 'updatedAt', 'deletedAt'];

/**
 * Obtiene los campos permitidos y sus tipos de datos correspondientes en base al modelo dado.
 * @param {object} model - El modelo de Sequelize a partir del cual se obtienen los campos permitidos.
 * @returns {object} - Un objeto con los nombres de los campos permitidos como claves y sus tipos de datos correspondientes como valores.
 */
const getAllowedFields = model => {
  // Se obtienen los atributos brutos del modelo.
  const rawAttributes = model.rawAttributes;
  // Se crea un objeto vacío que contendrá los nombres de los campos permitidos como claves y sus tipos de datos correspondientes como valores.
  const allowedFields = {};
  // Se recorren los atributos brutos del modelo.
  for (const key in rawAttributes) {
    // Se verifica si el atributo es una propiedad propia del objeto.
    if (rawAttributes.hasOwnProperty(key)) {
      // Se obtiene el tipo de datos del atributo.
      const { type } = rawAttributes[key];
      // Se mapea el tipo de datos de Sequelize al tipo de datos correspondiente en JavaScript.
      const fieldType = mapSequelizeTypeToDataType(type);
      // Si el tipo de datos mapeado existe y el nombre del campo no está en la lista de campos excluidos, se agrega el campo al objeto de campos permitidos.
      if (fieldType && !excludedFields.includes(key)) {
        allowedFields[key] = fieldType;
      }
    }
  }
  // Se retorna el objeto de campos permitidos.
  return allowedFields;
};

// Un objeto que contiene funciones de validación para cada tipo de datos permitido
const validators = {
  string: value => typeof value === 'string',
  char: value => typeof value === 'string',
  enum: value => typeof value === 'string',
  integer: value => typeof value === 'number' && isFinite(value),
  boolean: value => typeof value === 'boolean',
  date: value => value instanceof Date && !isNaN(value.getTime())
};

// Funciones de validación adicionales para tipos de datos específicos
const validateEnum = (value, attribute) => {
  return attribute.values && !attribute.values.includes(value);
};

const validateChar = (value, attribute) => {
  return value.length !== attribute.type.options.length;
};

const validateString = (value, attribute) => {
  return value.length > attribute.type.options.length;
};

const validateDataType = (value, attribute) => {
  const type = mapSequelizeTypeToDataType(attribute.type);
  return !(type in validators) || !validators[type](value);
};

/**
 * Valida si los campos de un objeto tienen el tipo de dato correcto según el modelo de Sequelize dado
 * @param {Object} data - Objeto (req.body) con los campos a validar
 * @param {Model} model - Modelo de Sequelize que define la estructura de los campos y sus tipos de datos
 * @returns {Object} Resultado de la validación:
 *                    - data: si la validación fue exitosa, será 'Campos válidos'; de lo contrario, será un objeto con los campos que no pasaron la validación y sus respectivos mensajes de error
 *                    - success: true si la validación fue exitosa, false de lo contrario
 */
export const validateFieldsDataType = (data, model) => {
  // Obtiene los campos permitidos según el modelo
  const allowedFields = getAllowedFields(model);

  // Objeto donde se almacenarán los errores
  const errors = {};

  // Recorre los campos permitidos y valida si el campo en data tiene el tipo de dato correcto
  for (const key of Object.keys(allowedFields)) {
    // Si el campo no está en data, se omite y continúa con el siguiente
    if (!(key in data)) {
      continue;
    }

    // Obtiene la información del campo según el modelo
    const attribute = model.rawAttributes[key];

    // Obtiene el valor del campo en data
    const value = data[key];

    // Obtiene el tipo de dato del campo según el modelo
    const type = mapSequelizeTypeToDataType(attribute.type);

    // Si el tipo de dato es un string y el valor excede la longitud especificada, se agrega un error al objeto de errores
    if (type === 'string' && validateString(value, attribute)) {
      errors[key] = `El valor excede el límite de ${attribute.type.options.length} caracteres`;
      continue;
    }

    // Si el tipo de dato es un char y el valor no tiene la longitud exacta especificada, se agrega un error al objeto de errores
    if (type === 'char' && validateChar(value, attribute)) {
      errors[key] = `El valor debe tener una longitud exacta de ${attribute.type.options.length} caracteres`;
      continue;
    }

    // Si el tipo de dato es un enum y el valor no está en los valores permitidos, se agrega un error al objeto de errores
    if (type === 'enum' && validateEnum(value, attribute)) {
      errors[key] = `El valor no es válido`;
      continue;
    }

    // Si el tipo de dato no está en el objeto de validadores o el valor no pasa la validación del tipo de dato, se agrega un error al objeto de errores
    if (type && validateDataType(value, attribute)) {
      errors[key] = `El tipo o valor no es válido`;
      continue;
    }
  }

  // Si hay errores, se devuelve un objeto con los errores; de lo contrario, se devuelve un objeto indicando que la validación fue exitosa
  if (Object.keys(errors).length > 0) {
    return { data: errors, success: false };
  } else {
    return { data: 'Campos válidos', success: true };
  }
};

/**
 * Verifica que un objeto tenga todas las claves requeridas
 * @param {Object} object - Objeto a verificar
 * @param {Array} requiredKeys - Claves requeridas
 * @param {Array} optionalKeys - Claves opcionales
 * @returns {Object|Array} - Devuelve un objeto con sólo las claves requeridas y opcionales,
 *                          o un array con las claves requeridas faltantes
 */
const hasAllKeys = (object, requiredKeys, optionalKeys = []) => {
  const objectKeys = Object.keys(object);
  // Verifica si faltan claves requeridas
  const missingKeys = requiredKeys.filter(key => !objectKeys.includes(key));
  if (missingKeys.length > 0) {
    return missingKeys;
  }

  // Crea un objeto con las claves requeridas y opcionales especificadas
  const filteredObject = {};
  const allKeys = requiredKeys.concat(optionalKeys);
  for (const key of allKeys) {
    if (object.hasOwnProperty(key)) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
};

/**
 * Valida el body de una solicitud HTTP en base a las propiedades del modelo Sequelize.
 * @param {object} body - El body de la solicitud HTTP.
 * @param {Sequelize.Model} model - El modelo Sequelize correspondiente.
 * @returns {object} Si el body es válido, devuelve el objeto filtrado sin las propiedades no permitidas. Si hay errores de validación, devuelve un objeto con el mensaje de error correspondiente.
 */
export const validateRequestBody = async (body, model) => {
  const { rawAttributes } = model;

  // Se crean dos arrays para almacenar las claves obligatorias y opcionales.
  const requiredKeys = [];
  const optionalKeys = [];

  // Se itera sobre las propiedades del modelo Sequelize para determinar cuáles son las claves obligatorias y opcionales.
  Object.keys(rawAttributes).forEach(key => {
    const { defaultValue } = rawAttributes[key];
    // Si no tiene valor por defecto y no es una clave reservada, se considera obligatoria.
    if (defaultValue === undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt') {
      requiredKeys.push(key);
    } else {
      optionalKeys.push(key);
    }
  });

  // Se filtran las claves del objeto body para asegurarse de que solo se pasen las claves permitidas.
  const filteredObject = hasAllKeys(body, requiredKeys, optionalKeys);

  // Si hay claves faltantes, se devuelve un objeto con el mensaje de error correspondiente.
  if (Array.isArray(filteredObject)) {
    return { error: `Faltan las siguientes claves: ${filteredObject.join(', ')}` };
  }

  // Se valida el tipo de datos de cada propiedad del objeto filtrado.
  const isValid = validateFieldsDataType(filteredObject, model);

  // Si hay errores de validación, se devuelve un objeto con el mensaje de error correspondiente.
  if (!isValid.success) {
    return { error: isValid.data };
  }

  // Si todo es válido, se devuelve el objeto filtrado sin las propiedades no permitidas.
  return filteredObject;
};

export const formatDate = (date, format = 'D/MM/YYYY [a las] HH:mm:ss A') => {
  const timeZoneChile = 'America/Santiago';

  const dateChile = moment(date).tz(timeZoneChile).locale('es').format(format);

  return dateChile;
}

export const validateRUT = (rut) => {
  let splitRUT = rut.split('-');
  let verificationDigit = splitRUT[1].toUpperCase();
  let rutWithoutDigit = splitRUT[0].replace(/\./g, '');
  let sum = 0;
  let multiplier = 2;
  for (let i = rutWithoutDigit.length - 1; i >= 0; i--) {
    sum += multiplier * rutWithoutDigit.charAt(i);
    if (multiplier < 7) {
      multiplier += 1;
    } else {
      multiplier = 2;
    }
  }
  let calculatedDigit = 11 - (sum % 11);
  if (calculatedDigit == 11) {
    calculatedDigit = '0';
  } else if (calculatedDigit == 10) {
    calculatedDigit = 'K';
  } else {
    calculatedDigit = calculatedDigit.toString();
  }
  if (calculatedDigit != verificationDigit) {
    return false;
  } else {
    return true;
  }
}
