import express from 'express';
import passport from 'passport';
import { roles } from '../helpers/enums.js';
import { isLoggedIn, isNotLoggedIn, permissiveActionLink, permissiveActionLinkRole } from '../lib/auth.js';
import { getLogin, getRegister, resetPassword, getHome } from '../modules/controllers/loginController.js'
import { getTeams, getTeam, addTeam, deleteTeam, getCars, getDrivers, getPassengers, getTasks } from '../modules/controllers/teamController.js';
import { getCampaigns, getCampaign, addCampaign, updateCampaign, deleteUserFromCampaign, getNonCampaignUsers, addUsersToCampaign, generateReport } from '../modules/controllers/campaignController.js';
import { getBlocks, getBlock, addBlock, updateBlock } from '../modules/controllers/blockRegistrationController.js';
import { getFocuses, getFocus, addFocus, updateFocus } from '../modules/controllers/focusController.js';
import { addHouseRegistration, getHouseRegistrations, getHouseRegistration, updateHouseRegistration } from '../modules/controllers/houseRegistrationController.js';
import { getTreeSpeciesRegistrations, getTreeRegistration, addTreeSpeciesRegistration, updateTreeRegistration, addProspectus } from '../modules/controllers/treeSpeciesRegistrationController.js'
import { getProspects, getProspectus, updateProspectus } from '../modules/controllers/prospectusController.js';
import { getAdminUser, addUser, updateUser, deleteUser, getOtherManagers, getAdminUsers } from '../modules/controllers/userController.js';
import { getAdminCars, getCar, addCar, updateCar } from '../modules/controllers/carController.js';
import { getAdminTreeSpecies, getAdminTreeSpecie, addTreeSpecies, updateTreeSpecies } from '../modules/controllers/treeSpeciesController.js';
import { getAccount, updatedAccount } from '../modules/controllers/accountController.js';


export const router = express.Router();

// Iniciar Sesión
router.get('/', isNotLoggedIn, getLogin);
router.get('/home', isLoggedIn, getHome);
router.post('/login', passport.authenticate('localStrategyLogin', {
  successRedirect: '/home',
  failureRedirect: '/',
}));
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

// Registrarse
router.get('/register', isNotLoggedIn, getRegister);
router.post('/register', passport.authenticate('localStrategyRegister', {
  successRedirect: '/',
  failureRedirect: '/',
}));

// Cuenta
router.get('/account', isLoggedIn, getAccount);
router.patch('api/account/:userId', isLoggedIn, updatedAccount);

// Usuarios
router.delete('/api/users/:id', permissiveActionLink(roles.ADMIN), deleteUser);
router.post('/api/users/reset-password', isNotLoggedIn, resetPassword);
router.get('/api/managers/:currentManagerId', permissiveActionLink(roles.MANAGER), getOtherManagers);

// Campañas
router.get('/campaigns', permissiveActionLink(roles.MANAGER), getCampaigns);
router.get('/campaigns/:CampaignId', permissiveActionLink(roles.SUPERVISOR), getCampaign);
router.post('/api/campaigns', permissiveActionLink(roles.MANAGER), addCampaign);
router.patch('/api/campaigns/:CampaignId', permissiveActionLink(roles.SUPERVISOR), updateCampaign);
// Informe
router.get('/api/campaigns/:CampaignId', permissiveActionLink(roles.SUPERVISOR), generateReport);
// Usuarios de campañas
router.delete('/api/campaigns/:CampaignId/users/:UserRegistrationId', permissiveActionLink(roles.SUPERVISOR), deleteUserFromCampaign);
router.get('/api/campaigns/:CampaignId/users/not-in', permissiveActionLink(roles.SUPERVISOR), getNonCampaignUsers);
router.post('/api/campaigns/:CampaignId/users', permissiveActionLink(roles.SUPERVISOR), addUsersToCampaign);
// Teams
router.get('/teams', permissiveActionLink(roles.SUPERVISOR), getTeams);
router.get('/teams/:TeamId', permissiveActionLink(roles.PROSPECTOR), getTeam); // Revisar si necesita algún otro permiso
router.post('/teams', permissiveActionLink(roles.SUPERVISOR), addTeam);
router.delete('/teams/:TeamId', permissiveActionLink(roles.SUPERVISOR), deleteTeam);
router.get('/cars', permissiveActionLink(roles.SUPERVISOR), getCars);
router.get('/drivers', permissiveActionLink(roles.SUPERVISOR), getDrivers);
router.post('/passengers', permissiveActionLink(roles.SUPERVISOR), getPassengers);
router.get('/tasks', permissiveActionLink(roles.SUPERVISOR), getTasks);

// Focos 
router.get('/campaigns/:CampaignId/focuses', permissiveActionLink(roles.SUPERVISOR), getFocuses);
router.get('/campaigns/:CampaignId/focuses/:FocusId', permissiveActionLink(roles.SUPERVISOR), getFocus);
router.post('/api/campaigns/:CampaignId/focuses', permissiveActionLink(roles.SUPERVISOR), addFocus);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId', permissiveActionLink(roles.SUPERVISOR), updateFocus);

// Registro de manzanas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks', permissiveActionLink(roles.SUPERVISOR), getBlocks);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId', permissiveActionLink(roles.PROSPECTOR), getBlock);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks', permissiveActionLink(roles.SUPERVISOR), addBlock);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId', permissiveActionLink(roles.SUPERVISOR), updateBlock);

// Registro de casas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses', permissiveActionLink(roles.PROSPECTOR), getHouseRegistrations);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId', permissiveActionLink(roles.PROSPECTOR), getHouseRegistration);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses', permissiveActionLink(roles.PROSPECTOR), addHouseRegistration);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId', permissiveActionLink(roles.PROSPECTOR), updateHouseRegistration);

// Registro de árbol
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees', permissiveActionLink(roles.PROSPECTOR), getTreeSpeciesRegistrations);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', permissiveActionLink(roles.PROSPECTOR), getTreeRegistration);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/', permissiveActionLink(roles.PROSPECTOR), addTreeSpeciesRegistration);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', permissiveActionLink(roles.PROSPECTOR), updateTreeRegistration);
// prospecto
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', permissiveActionLink(roles.PROSPECTOR), addProspectus);

// Analista
router.get('/prospects', permissiveActionLinkRole([roles.ANALYST, roles.ADMIN]), getProspects);
router.get('/prospects/:ProspectusId', permissiveActionLinkRole([roles.ANALYST, roles.ADMIN]), getProspectus);
router.patch('/prospects/:ProspectusId', permissiveActionLinkRole([roles.ANALYST, roles.ADMIN]), updateProspectus);

// Admin Autos
router.get('/admin-cars', permissiveActionLink(roles.ADMIN), getAdminCars);
router.get('/admin-cars/:CarId', permissiveActionLink(roles.ADMIN), getCar);
router.post('/admin-cars', permissiveActionLink(roles.ADMIN), addCar)
router.patch('/api/cars/:CarId', permissiveActionLink(roles.ADMIN), updateCar);

// Admin Usuarios
router.get('/admin-users', permissiveActionLink(roles.ADMIN), getAdminUsers);
router.get('/admin-users/:UserId', permissiveActionLink(roles.ADMIN), getAdminUser);
router.post('/admin-users', permissiveActionLink(roles.ADMIN), addUser);
router.patch('/api/users/:UserId', permissiveActionLink(roles.ADMIN), updateUser);

//Admin Especies de árbol
router.get('/admin-tree-species', permissiveActionLink(roles.SUPERVISOR), getAdminTreeSpecies);
router.get('/admin-tree-species/:TreeSpeciesId', permissiveActionLink(roles.SUPERVISOR), getAdminTreeSpecie);
router.post('/admin-tree-species', permissiveActionLink(roles.SUPERVISOR), addTreeSpecies);
router.patch('/api/admin-tree-species/:TreeSpeciesId', permissiveActionLink(roles.SUPERVISOR), updateTreeSpecies);