import { Sequelize } from "sequelize";
import models from "../models/index.js";
import { validateRequestBody } from '../../helpers/validators.js';

const { Focus } = models;

// Obtener todos los focos 
export const getFocuses = async (req,res) => {
    const fileHTML = 'search-focus';
    const title = 'Focos';

    try {
        const{ address, active = true } = req.query;// Obtener los parámetros de bùsqueda de la URL
        const { CampaignId } = req.params;

        // Convertir el valor openString a booleano (?)
        const activeBoolean = active === true;

        // Construir el objeto de búsqueda dinámicamente 
        const searchOptions = {
            ...(address && {address: { [Sequelize.Op.substring]: address} }),
            active: activeBoolean,
            CampaignId
        }
        // Obtener todos los focos con las propiedades
        const focused = await Focus.findAll({
            order:[['id','DESC']],
            attributes: ['id', 'address', 'active'],
            where: searchOptions,
        });

        const data = focused.length > 0 ? focused : 'No hay focos registrados o que coincidan con tu búsqueda';

        return res.render('index.html', { formattedFocused: data, fileHTML, title });
    }catch(error){
        return res.render('error.html',{error: 404 });
    }
};

//Agregar un foco 
export const addFocus = async (req, res) => {
    try{
        // Valida que vengan datos en el cuerpo
        if (Object.keys(req.body).length === 0 ){
            return res.status(400).json({ error:'El cuerpo de la solicitud esta vacío'});
        }

        const { address } = req.body;
        // const { CampaignId } = req.params;
        const CampaignId = parseInt(req.params.CampaignId, 10);

        const object = {
            address,
            CampaignId
        }
        
        // Filtrar y validar el cuerpo de la solicitud
        const validatedObject = await validateRequestBody(object, Focus);
        

        console.log(validatedObject);
        // Comprobar errores de validacion
        if (validatedObject.error){
            return res.status(400).json(validatedObject);
        }

        //Crear un nuevo foco en la BBDD y volverla como respuesta
        const focus = await Focus.create(validatedObject);
        return res.status(201).json(focus.toJSON());
   } catch(error){
    console.error('Error al insertar un foco', error);
    return res.status(500).json({error: 'Ocurrió un error en el servidor'});
   }
};
