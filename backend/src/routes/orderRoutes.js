import {Router} from 'express';
import {requireAuth} from '../middleware/auth.js';
import {createOrder,listMyOrders,getMyOrder} from '../controllers/orderController.js';
const r=Router();
r.use(requireAuth);
r.post('/',createOrder);
r.get('/mine',listMyOrders);
r.get('/:id',getMyOrder);
export default r;
