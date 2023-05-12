import express from 'express';
import { getUsers, getUser, addUser, updateUser, deleteUser } from '../modules/controllers/userController.js';
import { addCampaign } from '../modules/controllers/campaignController.js';

export const router = express.Router();

// User
router.get( '/api/users', getUsers );
router.get( '/api/users/:id', getUser );
router.post( '/api/users', addUser );
router.patch( '/api/users/:id', updateUser );
router.delete( '/api/users/:id', deleteUser );

// Campaign
router.post('/api/campaigns', addCampaign );

router.get('/:nombreArchivo', (req, res) =>{
  const fileHTML = req.params.nombreArchivo;
  res.render('index.html', { fileHTML });
});
