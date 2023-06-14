import { getPermissionLevel } from "../helpers/validators.js";


//modulo para validar si el usuario esta autenticado 
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //si esta autenticado sigue
    return next();
  }
  //si no lo redirige a /signin
  return res.redirect('/');
};

export const permissiveActionLink = (minimumRoleRequired) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/');

    const requestorRole = req.user.role;
    
    const minimumPermissionLevel = getPermissionLevel(minimumRoleRequired);
    const requestorPermissionLevel = getPermissionLevel(requestorRole);

    if (requestorPermissionLevel >= minimumPermissionLevel) {
      return next();
    }
    return res.redirect('/home');
  };
};

export const permissiveActionLinkRole = (rolesRequired) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/');

    const requestorRole = req.user.role;

    if (rolesRequired.includes(requestorRole)) {
      return next();
    }
    return res.redirect('/home');
  };
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/home');
};