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
    const userData = await User.findOne({
      where: { email: email }
    });
    // Traer contraseña de base de datos para comparar en matchPassword
    if (userData) {
      const validPassword = await helpers.matchPassword(password, userData.dataValues.password);
      if (validPassword) {
        //Modificar mensaje
        const user = userData.dataValues;
        console.log(user);
        console.log("Contraseña correcta");
        done(null, user);
      } else {
        console.log("Contraseña incorrecta");
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
  const { run, dvRun } = helpers.separarRut(req.body.run);
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
  console.log('Serializando el ID: '+usuario.id);
  done(null, usuario.id);
  console.log('Serialización completada correctamente.');
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    console.log('Deserializando el ID: '+user.dataValues.id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Exportar las estrategias como un objeto
