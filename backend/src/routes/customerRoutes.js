import {Router} from 'express';
import {requireAuth} from '../middleware/auth.js';
import {getProfile,updateProfile,changePassword} from '../controllers/customerController.js';
const r=Router();
r.use(requireAuth);
r.get('/profile',getProfile);
r.put('/profile',updateProfile);
r.put('/password',changePassword);
export default r;
