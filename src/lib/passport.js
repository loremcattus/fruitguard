import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import models from '../modules/models/index.js';
import { roles } from '../helpers/enums.js';

const { User } = models;

import helpers from '../lib/helpers.js';



export const localStrategyLogin = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ 
          where: { email: email } 
        });
        // Traer contraseña de base de datos para comparar en matchPassword
        if (user) {
            const validPassword = await helpers.matchPassword(password, user.dataValues.password);
            if (validPassword) {
                //Modificar mensaje
                console.log("Cotraseña correcta");
                done(null, user);
            } else {
              console.log("Cotraseña incorrecta");
                done(null, false);
            }
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error);
    }
});


//recibiendo los datos del Sign Up datos para registrarse EN LA BBDD
export const localStrategyRegister = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const { run, dvRun } = separarRun(req.body.run);
    const { name } = req.body;
    const newUser = {
      name,
      run,
      dvRun,
      email,
      password: await helpers.encryptPassword(password)
    };
    try {
      const createdUser = await User.create(newUser);
      newUser.id = createdUser.dataValues.id;
      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  });

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

function separarRun(rutCompleto) {
  const partes = rutCompleto.split('-');
  const run = partes[0];
  const dvRun = partes[1];
  
  return { run, dvRun };
}

// Exportar las estrategias como un objeto
