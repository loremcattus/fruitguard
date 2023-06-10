import express from 'express';
import passport from 'passport';
import { getLogin, getRegister, resetPassword } from '../modules/controllers/loginController.js'
import { getTeams, getCars, getDrivers } from '../modules/controllers/teamController.js';
import { getUsers, getUser, addUser, updateUser, deleteUser, getOtherManagers } from '../modules/controllers/userController.js';
import { getCampaigns, getCampaign, addCampaign, updateCampaign, deleteUserFromCampaign, getNonCampaignUsers, addUsersToCampaign } from '../modules/controllers/campaignController.js';
import { getBlocks, getBlock, addBlock, updateBlock } from '../modules/controllers/blockRegistrationController.js';
import { getFocuses, getFocus, addFocus, updateFocus } from '../modules/controllers/focusController.js';
import { addHouseRegistration, getHouseRegistrations, getHouseRegistration, updateHouseRegistration } from '../modules/controllers/houseRegistrationController.js';
import { getTreeSpeciesRegistrations, getTreeRegistration, addTreeSpeciesRegistration,updateTreeRegistration, addProspectus } from '../modules/controllers/treeSpeciesRegistrationController.js'
import { getAccount, updatedAccount } from '../modules/controllers/accountController.js';

export const router = express.Router();

// Iniciar Sesión
router.get('/', getLogin);
router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Registrarse
router.get('/register', getRegister);
router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Cuenta
router.get('/account/:userId',getAccount);
router.patch('/api/account/:userId',updatedAccount );

// Usuarios
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUser);
router.post('/api/users', addUser);
router.patch('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);
router.post('/api/users/reset-password', resetPassword);
router.get('/api/managers/:currentManagerId', getOtherManagers);

// Campañas
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:CampaignId', getCampaign);
router.post('/api/campaigns', addCampaign);
router.patch('/api/campaigns/:CampaignId', updateCampaign);
// Usuarios de campañas
router.delete('/api/campaigns/:CampaignId/users/:UserRegistrationId', deleteUserFromCampaign);
router.get('/api/campaigns/:CampaignId/users/not-in', getNonCampaignUsers);
router.post('/api/campaigns/:CampaignId/users', addUsersToCampaign);
// Teams
router.get('/teams', getTeams);
router.get('/cars', getCars);
router.get('/drivers', getDrivers);

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
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees', addTreeSpeciesRegistration);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId', updateTreeRegistration);

// registro Prospecto 
// add Prospecto desde la bista de árbol
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees/:TreeSpeciesRegistrationId',addProspectus );