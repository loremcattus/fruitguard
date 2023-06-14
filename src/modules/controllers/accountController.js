import { formatDate, validateFieldsDataType } from "../../helpers/validators.js";
import models from "../models/index.js";

const { User } = models;

// Obtener cuenta 
export const getAccount = async (req,res) => {
    const fileHTML = 'view-account';
    const title = 'Mi perfil';
    const single = true;

    const userId = req.user.id;

    try{
        const user = await User.findByPk(userId,{
            attributes:['id',
                    'name',
                    'run',
                    'dvRun',
                    'email',
                    'password',
                    'hasLicense',
                    'role',
                    'createdAt',
                    'updatedAt']
        });

        console.log(req.params);

        if (user){
            const { createdAt,updatedAt,...data }= user.dataValues;
            data.createdAt = formatDate(createdAt);
            data.updatedAt = formatDate(updatedAt);
            return res.render('index.html',{formattedUser: data , fileHTML, title, single })
        } else {
            return res.render('error.html',{error : 400 });
        }
    } catch (error) {
        console.log(error);
        return res.render('error.html',{ error: 500 });
    }
};

// Editar cuenta
export const updatedAccount = async (req, res) => {
    try{
        // Validar que vengan datos en el cuerpo 
        if(Object.keys(req.body).length === 0 ){
            return res.status(400).json('El cuerpo de la solicitud esta vacío.');
        }
        // Validar el cuerpo de la solicitud
        const validatedFields = await validateFieldsDataType( req.body, User );

        // Comprobar errores de calidacion 
        if(validatedFields.errors){
            return res.status(400).json(validatedFields.errors);
        }
        console.log( req.body );
        let user = await User.update(req.body,{
            where:{
                id:req.params.userId
            }
        });
        console.log(user);
        
        return res.status(200).json(user);
    } catch ( error ){
        console.error('Error al actualizar el usuario', error);
        return res.status(500).json({error: 'Ocurrió un erro en el servidor'});
    }
}