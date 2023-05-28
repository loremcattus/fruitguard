import express from 'express';
import { getUsers, getUser, addUser, updateUser, deleteUser } from '../modules/controllers/userController.js';
import { getCampaigns, getCampaign, addCampaign } from '../modules/controllers/campaignController.js';
import { getBlocks, getBlock, addBlock } from '../modules/controllers/blockController.js';
import { getFocuses, getFocus, addFocus } from '../modules/controllers/focusController.js';
import { addHouses, getHouses } from '../modules/controllers/houseController.js';
import { addHouseRegistration, getHouseRegistration } from '../modules/controllers/house_registrationController.js';

export const router = express.Router();

// Usuarios
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUser);
router.post('/api/users', addUser);
router.patch('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);

// Campañas
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:CampaignId', getCampaign);
router.post('/api/campaigns', addCampaign);

// Focos 
router.get('/campaigns/:CampaignId/focuses', getFocuses);
router.get('/campaigns/:CampaignId/focuses/:FocusId',getFocus);
router.post('/api/campaigns/:CampaignId/focuses', addFocus);

// Manzanas
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks', getBlocks);
router.get('/campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockId', getBlock);
router.post('/api/campaigns/:CampaignId/focuses/:FocusId/blocks', addBlock);
// Casas
router.get('/api/houses', getHouses);
router.post('/api/houses', addHouses);

// Registro de casas
router.get('/houses', getHouseRegistration);
router.post('/api/housesRegistrations', addHouseRegistration);
