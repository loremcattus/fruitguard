import express from 'express';
import { getUsers, getUser, addUser, updateUser, deleteUser, getOtherManagers } from '../modules/controllers/userController.js';
import { getCampaigns, getCampaign, addCampaign, updateCampaign, deleteUserFromCampaign, getNonCampaignUsers } from '../modules/controllers/campaignController.js';
import { getBlocks, getBlock, addBlock, updateBlock } from '../modules/controllers/blockController.js';
import { getFocuses, getFocus, addFocus, updateFocus } from '../modules/controllers/focusController.js';
import { addHouses, getHouses } from '../modules/controllers/houseController.js';
import { addHouseRegistration, getHouseRegistrations } from '../modules/controllers/house_registrationController.js';
import { getTreeSpeciesRegistrations } from '../modules/controllers/treeSpeciesRegistrationController.js'


export const router = express.Router();

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
router.get('/api/campaigns/:CampaignId/users/not-in/', getNonCampaignUsers);

// Focos 
router.get('/campaigns/:CampaignId/focuses', getFocuses);
router.get('/campaigns/:CampaignId/focuses/:FocusId',getFocus);
router.post('/api/campaigns/:CampaignId/focuses', addFocus);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId', updateFocus);

// Manzanas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks', getBlocks);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockId', getBlock);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks', addBlock);
router.patch('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockId', updateBlock);
// Casas
// router.get('/api/houses', getHouses);
// router.post('/api/houses', addHouses);

// Registro de casas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses', getHouseRegistrations);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses', addHouseRegistration);

// registro de árbol
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees', getTreeSpeciesRegistrations);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses/:HouseRegistrationId/trees');