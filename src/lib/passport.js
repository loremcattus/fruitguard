const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const connection = require('../database/database.js');
const helpers = require('../lib/helpers');

//validar usuarios y contrasenna
passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contra',
    passReqToCallback: true
}, async (req, correo, contra, done) => {
    let rows;
    rows = await connection.query('SELECT * FROM usuario WHERE usuario_correo = ?', [correo]);
    console.log(rows.length);
    if (rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contra, user.usuario_contra);
        if (validPassword) {
            done(null, user, req.flash('success','Bienvenido' + user.usuario_correo));
        } else {
            done(null, false, req.flash('message','Contraseña Incorrecta'))
        }
    } else {
        return done(null, false, req.flash('message','Este usuario no existe'));
    }
}));

//recibiendo los datos del Sign Up datos para registrarse EN LA BBDD
passport.use('local.registrarse', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contra',
    passReqToCallback: true
  }, async (req, correo, contra,  done) => {
      console.log('RUTA CORRECTA PARA REGISTRARSE');
      console.log(req.body);
      console.log(correo);
      console.log(contra);
      console.log(done);
      const { nombre, apellido, rut, sexo, fechaNac, telef, } = req.body;
      const newUser = {
        usuario_correo: correo,
        usuario_contra:  contra,
        usuario_nombre:  nombre,
        usuario_apellido:  apellido,
        usuario_rut:  rut,
        usuario_sexo:  sexo,
        usuario_telef:  telef,
        usuario_fechaNac:  fechaNac,
        usuario_rol : 'Paciente',
      };
      console.log(newUser);
      newUser.usuario_contra = await helpers.encryptPassword(contra);
      const result = await connection.query('INSERT INTO usuario SET ?', [newUser]);
      newUser.id_usuario = result.insertId;
      return done(null, newUser);
  }));

//recibiendo los datos del Sign Up datos para registrarse EN LA BBDD
passport.use('admin.registrarse', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contra',
    passReqToCallback: true
  }, async (req, correo, contra) => {
      console.log('RUTA CORRECTA PARA REGISTRARSE');
      console.log(req.body);
      console.log(correo);
      console.log(contra);
      const { nombre, apellido, rut, sexo, fechaNac, telef, rol} = req.body;
      const newUser = {
        usuario_correo: correo,
        usuario_contra:  contra,
        usuario_nombre:  nombre,
        usuario_apellido:  apellido,
        usuario_rut:  rut,
        usuario_sexo:  sexo,
        usuario_telef:  telef,
        usuario_fechaNac:  fechaNac,
        usuario_rol : rol,
      };
      console.log(newUser);
      newUser.usuario_contra = await helpers.encryptPassword(contra);
      const result = await connection.query('INSERT INTO usuario SET ?', [newUser]);
      newUser.id_usuario = result.insertId;
  }));



passport.serializeUser((usuario, done) => {
  done(null, usuario.id_usuario);
});

passport.deserializeUser( async (id_usuario, done) => {
    const rows = await connection.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
    done(null, rows[0]); 
});