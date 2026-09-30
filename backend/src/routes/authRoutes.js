import {Router} from 'express';
import {authLimiter} from '../middleware/rateLimiters.js'; import {register,login,adminLogin} from '../controllers/authController.js';
const r=Router(); r.post('/register',authLimiter,register); r.post('/login',authLimiter,login); r.post('/admin/login',authLimiter,adminLogin); export default r;
