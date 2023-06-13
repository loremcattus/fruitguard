import express from 'express';
import passport from 'passport';
import { getLogin, getRegister, resetPassword, getHome } from '../modules/controllers/loginController.js'
import { getTeams, getTeam, addTeam, deleteTeam, getCars, getDrivers, getPassengers, getTasks } from '../modules/controllers/teamController.js';
import { getCampaigns, getCampaign, addCampaign, updateCampaign, deleteUserFromCampaign, getNonCampaignUsers, addUsersToCampaign, generateReport } from '../modules/controllers/campaignController.js';
import { getBlocks, getBlock, addBlock, updateBlock } from '../modules/controllers/blockRegistrationController.js';
import { getFocuses, getFocus, addFocus, updateFocus } from '../modules/controllers/focusController.js';
import { addHouseRegistration, getHouseRegistrations, getHouseRegistration, updateHouseRegistration } from '../modules/controllers/houseRegistrationController.js';
import { getTreeSpeciesRegistrations, getTreeRegistration, addTreeSpeciesRegistration,updateTreeRegistration, addProspectus } from '../modules/controllers/treeSpeciesRegistrationController.js'
import { getProspects, getProspectus, updateProspectus } from '../modules/controllers/prospectusController.js';
import { getAdmin, getLoginAdmin } from '../modules/controllers/adminController.js';
import { getAdminUser, addUser, updateUser, deleteUser, getOtherManagers, getAdminUsers } from '../modules/controllers/userController.js';
import { getAdminCars, getCar, addCar, updateCar } from '../modules/controllers/carController.js';
import { getAdminTreeSpecies, getAdminTreeSpecie, addTreeSpecies, updateTreeSpecies  } from '../modules/controllers/treeSpeciesController.js';



export const router = express.Router();

// Iniciar Sesión
router.get('/', getLogin);
router.get('/home', getHome);
router.post('/login', passport.authenticate('localStrategyLogin', {
    successRedirect: '/home',
    failureRedirect: '/',
}));
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});


// Registrarse
router.get('/register', getRegister);
router.post('/register', passport.authenticate('localStrategyRegister', {
    successRedirect: '/',
    failureRedirect: '/',
}));


// Usuarios

router.delete('/api/users/:id', deleteUser);
router.post('/api/users/reset-password', resetPassword);
router.get('/api/managers/:currentManagerId', getOtherManagers);

// Campañas
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:CampaignId', getCampaign);
router.post('/api/campaigns', addCampaign);
router.patch('/api/campaigns/:CampaignId', updateCampaign);
// Informe
router.get('/api/campaigns/:CampaignId', generateReport);
// Usuarios de campañas
router.delete('/api/campaigns/:CampaignId/users/:UserRegistrationId', deleteUserFromCampaign);
router.get('/api/campaigns/:CampaignId/users/not-in', getNonCampaignUsers);
router.post('/api/campaigns/:CampaignId/users', addUsersToCampaign);
// Teams
router.get('/teams', getTeams);
router.get('/teams/:TeamId', getTeam);
router.post('/teams', addTeam);
router.delete('/teams/:TeamId', deleteTeam);
router.get('/cars', getCars);
router.get('/drivers', getDrivers);
router.post('/passengers', getPassengers);
router.get('/tasks', getTasks);

// Focos 
router.get('/campaigns/:CampaignId/focuses', getFocuses);
router.get('/campaigns/:CampaignId/focuses/:FocusId',getFocus);
router.post('/api/campaigns/:CampaignId/focuses', addFocus);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId', updateFocus);

// Manzanas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks', getBlocks);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId', getBlock);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks', addBlock);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId', updateBlock);
// Casas
// router.get('/api/houses', getHouses);
// router.post('/api/houses', addHouses);

// Registro de casas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses', getHouseRegistrations);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId', getHouseRegistration);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses', addHouseRegistration);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId', updateHouseRegistration);

// registro de árbol
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees', getTreeSpeciesRegistrations);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', getTreeRegistration);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/', addTreeSpeciesRegistration);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', updateTreeRegistration);
// prospecto
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', addProspectus);

// Analista
router.get('/prospects', getProspects);
router.get('/prospects/:ProspectusId', getProspectus);
router.patch('/prospects/:ProspectusId', updateProspectus);

// Admin 
router.get('/loginAdmin', getLoginAdmin);
router.post('/loginAdmin', passport.authenticate('localStrategyLoginAdmin', {
    successRedirect: '/admin',
    failureRedirect: '/',
}));
router.get('/admin', getAdmin);

// Admin Autos
router.get('/admin-cars', getAdminCars);
router.get('/admin-cars/:CarId', getCar);
router.post('/admin-cars', addCar)
router.patch('/api/cars/:CarId', updateCar);

// Admin Usuarios
router.get('/admin-users', getAdminUsers);
router.get('/admin-users/:UserId', getAdminUser);
router.post('/admin-users', addUser);
router.patch('/api/users/:UserId', updateUser);

//Admin Especies de árbol
router.get('/admin-tree-species', getAdminTreeSpecies);
router.get('/admin-tree-species/:TreeSpeciesId', getAdminTreeSpecie);
router.post('/admin-tree-species', addTreeSpecies);
router.patch('/api/admin-tree-species/:TreeSpeciesId', updateTreeSpecies);