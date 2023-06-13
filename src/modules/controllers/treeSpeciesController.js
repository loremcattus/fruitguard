import models from '../models/index.js';
import { validateFieldsDataType } from '../../helpers/validators.js';

const { TreeSpecies } = models;

export const getAdminTreeSpecies = async (req, res) => {
    const fileHTML = 'admin-list-treeSpecies';
    const title = 'Administrar Especies de Árbol';

    try {
        const { species } = req.query; // Obtener los parámetros de búsqueda de la URL
    
        // Construir el objeto de búsqueda dinámicamente
        const searchOptions = {
          ...(species && { species }),
        };
    
        // Obtener todas las campañas con las propiedades definidas
        const treeSpecies = await TreeSpecies.findAll({
          order: [['id', 'DESC']],
          where: searchOptions
        });
    
        const data = treeSpecies.length > 0 ? treeSpecies : 'No hay autos registrados o que coincidan con tu búsqueda';

        return res.render('index.html', { data, fileHTML, title });
      } catch (error) {
        return res.render('error.html', { error: 500 });
      }

  }
  
  export const getAdminTreeSpecie = async (req, res) => {
    const fileHTML = 'admin-view-treeSpecie';
    const title = 'Administrar Especies de Árbol';
    const single = true;
  
    try {
  
      const treeSpecies = await TreeSpecies.findByPk(req.params.TreeSpeciesId, {
        attributes: ['id', 'species']
      });
  
      if (treeSpecies) {
        const { ...formattedTreeSpecies } = treeSpecies.dataValues;
  
        return res.render('index.html', { formattedTreeSpecies, fileHTML, title, single });
      } else {
        return res.render('error.html', { error: 404 });
      }
  
    } catch (error) {
      console.error(error);
      return res.render('error.html', { error: 500 });
    }
  }

  export const addTreeSpecies = async (req, res) => {
    try {
        // Valida que vengan datos en el cuerpo
        if (Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
        }
    
        // Filtrar y validar el cuerpo de la solicitud
        const validatedObject = await validateFieldsDataType(req.body, TreeSpecies);
        // Comprobar errores de validación
        if (!validatedObject.success) {
          return res.status(400).json(validatedObject.error);
        }
        // Crear en la base de datos y devolverla como respuesta
        const treeSpecies = await TreeSpecies.create(req.body);
        return res.status(201).json(treeSpecies.toJSON());
      } catch (error) {
        console.error('Error al insertar una campaña', error);
        return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
      }
  }

  export const updateTreeSpecies = async (req, res) => {
    try {
        // Valida que vengan datos en el cuerpo
        if (Object.keys(req.body).length === 0) {
          return res.status(400).json('El cuerpo de la solicitud está vacío.');
        }

        await TreeSpecies.update(req.body, {
          where: {
            id: req.params.TreeSpeciesId
          }
        });
    
        return res.sendStatus(200);
      } catch (error) {
        console.error('Error al actualizar auto', error);
        return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
      }
  }