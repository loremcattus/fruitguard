import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType } from '../../helpers/validators.js';

const { House, force } = models;

const houseProps = [''];