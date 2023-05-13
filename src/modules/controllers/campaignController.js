import models from '../models/index.js';
import { validateFieldsDataType } from '../../helpers/validators.js';

const { Campaign } = models;

export const addCampaign = async (req, res) => {
  let campaign = req.body; // Solo obtener los datos que necesito
  let isValid = validateFieldsDataType(campaign, Campaign);
  if (isValid.success) {
    campaign = await Campaign.create(campaign);
    res.status(200).json(campaign.toJSON());
  } else {
    res.status(400).json({ message: isValid });
  };
};