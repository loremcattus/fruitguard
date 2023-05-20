import express from 'express';
import { getUsers, getUser, addUser, updateUser, deleteUser } from '../modules/controllers/userController.js';
import { getCampaigns, addCampaign } from '../modules/controllers/campaignController.js';
import { getFocused, addFocus } from '../modules/controllers/focusController.js';
import { getBlocks, addBlock } from '../modules/controllers/blockController.js';

export const router = express.Router();

// Usuarios
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUser);
router.post('/api/users', addUser);
router.patch('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);

// Campañas
router.get('/campaigns', getCampaigns);
router.post('/api/campaigns', addCampaign);

// Focos 
router.get('/focused',getFocused);
router.post('/api/focused',addFocus);

// Manzanas
router.get('/api/blocks', getBlocks);
router.post('/api/blocks', addBlock);
