import express from 'express';
import passport from 'passport';
import { getLogin, getRegister} from '../modules/controllers/loginController.js'
import { getUsers, getUser, addUser, updateUser, deleteUser, getOtherManagers } from '../modules/controllers/userController.js';
import { getCampaigns, getCampaign, addCampaign, updateCampaign, deleteUserFromCampaign, getNonCampaignUsers, addUsersToCampaign } from '../modules/controllers/campaignController.js';
import { getBlocks, getBlock, addBlock, updateBlock } from '../modules/controllers/blockRegistrationController.js';
import { getFocuses, getFocus, addFocus, updateFocus } from '../modules/controllers/focusController.js';
import { addHouseRegistration, getHouseRegistrations, getHouseRegistration, updateHouseRegistration } from '../modules/controllers/houseRegistrationController.js';
import { getTreeSpeciesRegistrations, getTreeRegistration, addTreeSpeciesRegistration,updateTreeRegistration } from '../modules/controllers/treeSpeciesRegistrationController.js'

export const router = express.Router();

// Iniciar Sesión
router.get('/login', getLogin);
router.get('/register', getRegister);
router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
router.post('/register', passport.authenticate('local.registrarse', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


// Usuarios
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUser);
router.post('/api/users', addUser);
router.patch('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);
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