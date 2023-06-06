module.exports = {
    //modulo para validar si el usuario esta autenticado 
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            //si esta autenticado sigue
            return next();
        }
        //si no lo redirige a /signin
        return res.redirect('/register');
    },

    isRoUser (req, res, next){
        //
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    }

};