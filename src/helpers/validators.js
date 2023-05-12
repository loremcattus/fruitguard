const dataTypeMap = {
  INTEGER: 'number',
  STRING: 'string',
  CHAR: 'char',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ENUM: 'enum',
};

const mapSequelizeTypeToDataType = sequelizeType => {
  const { key } = sequelizeType.constructor;
  return dataTypeMap[key] ? dataTypeMap[key] : null;
};

const excludedFields = ['id', 'createdAt', 'updatedAt', 'deletedAt'];

const getAllowedFields = model => {
  const rawAttributes = model.rawAttributes;
  const allowedFields = {};
  for (const key in rawAttributes) {
    if (rawAttributes.hasOwnProperty(key)) {
      const { type } = rawAttributes[key];
      const fieldType = mapSequelizeTypeToDataType(type);
      if (fieldType && !excludedFields.includes(key)) {
        allowedFields[key] = fieldType;
      }
    }
  }
  return allowedFields;
};

const validators = {
  string: value => typeof value === 'string',
  char: value => typeof value === 'string',
  enum: value => typeof value === 'string',
  number: value => typeof value === 'number' && isFinite(value),
  boolean: value => typeof value === 'boolean',
  date: value => value instanceof Date && !isNaN(value.getTime())
};

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

export const validateFieldsDataType = (data, model) => {
  const allowedFields = getAllowedFields(model);
  const errors = {};

  for (const key of Object.keys(allowedFields)) {
    if (!(key in data)) {
      continue;
    }

    const attribute = model.rawAttributes[key];
    const value = data[key];
    const type = mapSequelizeTypeToDataType(attribute.type);
    
    if (type === 'enum' && validateEnum(value, attribute)) {
      errors[key] = `El valor no es válido`;
      continue;
    }

    if (type === 'char' && validateChar(value, attribute)) {
      errors[key] = `El valor debe tener una longitud exacta de ${attribute.type.options.length} caracteres`;
      continue;
    }

    if (type === 'string' && validateString(value, attribute)) {
      errors[key] = `El valor excede el límite de ${attribute.type.options.length} caracteres`;
      continue;
    }

    if (type && validateDataType(value, attribute)) {
      errors[key] = `El tipo o valor no es válido`;
      continue;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { data: errors, success: false };
  } else {
    return { data: 'Campos válidos', success: true };
  }
};

const hasAllKeys = (object, requiredKeys, optionalKeys = []) => {
  const objectKeys = Object.keys(object);
  const missingKeys = requiredKeys.filter(key => !objectKeys.includes(key));
  if (missingKeys.length > 0) {
    return missingKeys;
  }
  const filteredObject = {};
  const allKeys = requiredKeys.concat(optionalKeys);
  for (const key of allKeys) {
    if (object.hasOwnProperty(key)) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
};

export const validateRequestBody = async (body, model) => {
  const { rawAttributes } = model;
  const requiredKeys = [];
  const optionalKeys = [];

  Object.keys(rawAttributes).forEach(key => {
    const { defaultValue } = rawAttributes[key];
    if (defaultValue === undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt') {
      requiredKeys.push(key);
    } else {
      optionalKeys.push(key);
    }
  });

  const filteredObject = hasAllKeys(body, requiredKeys, optionalKeys);
  if (Array.isArray(filteredObject)) {
    return { error: `Faltan las siguientes claves: ${filteredObject.join(', ')}` };
  }

  const isValid = validateFieldsDataType(filteredObject, model);

  if (!isValid.success) {
    return { error: isValid.data };
  }

  return filteredObject;
};

export const validateRUT = (rut) => {
  let splitRUT = rut.split('-');
  let verificationDigit = splitRUT[1].toUpperCase();
  let rutWithoutDigit = splitRUT[0].replace(/\./g,'');
  let sum = 0;
  let multiplier = 2;
  for(let i = rutWithoutDigit.length -1; i >= 0; i--) {
    sum += multiplier * rutWithoutDigit.charAt(i);
    if(multiplier < 7) {
      multiplier += 1;
    } else {
      multiplier = 2;
    }
  }
  let calculatedDigit = 11 - (sum % 11);
  if(calculatedDigit == 11){
    calculatedDigit = '0';
  } else if(calculatedDigit == 10) {
    calculatedDigit = 'K';
  } else {
    calculatedDigit = calculatedDigit.toString();
  }
  if(calculatedDigit != verificationDigit) {
    return false;
  } else {
    return true;
  }
}
