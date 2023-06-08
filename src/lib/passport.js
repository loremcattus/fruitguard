const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const connection = require('../database/database.js');
const helpers = require('../lib/helpers');

import User from '../modules/models/user.js';

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ 
          where: { email: email } 
        });
        console.log(user);
        // Traer contraseña de base de datos para comparar en matchPassword
        if (user) {
            const validPassword = await helpers.matchPassword(password, user.password);
            if (validPassword) {
                //Modificar mensaje
                done(null, user, req.flash('success', 'Bienvenido ' + user.email));
            } else {
                done(null, false, req.flash('message', 'Contraseña incorrecta'));
            }
        } else {
            done(null, false, req.flash('message', 'Este usuario no existe'));
        }
    } catch (error) {
        done(error);
    }
}));


//recibiendo los datos del Sign Up datos para registrarse EN LA BBDD
passport.use('local.registrarse', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    console.log('RUTA CORRECTA PARA REGISTRARSE');
    console.log(req.body);
    console.log(email);
    console.log(password);
    console.log(done);
    const { name, run, dvRun, hasLicense, role } = req.body;
    const newUser = {
      name: name,
      run: run,
      dvRun: dvRun,
      hasLicense: hasLicense,
      role: role,
      usuario_password: await helpers.encryptPassword(password)
    };
    console.log(newUser);
    try {
      const createdUser = await Usuario.create(newUser);
      newUser.id_usuario = createdUser.id_usuario;
      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));

passport.serializeUser((usuario, done) => {
  done(null, usuario.id_usuario);
});

passport.deserializeUser( async (id_usuario, done) => {
    const rows = await connection.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
    done(null, rows[0]); 
});