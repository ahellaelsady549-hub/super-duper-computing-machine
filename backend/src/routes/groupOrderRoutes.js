import {Router} from 'express';
import {requireAuth} from '../middleware/auth.js';
import {privateUpload} from '../middleware/upload.js';
import {createGroupOrder,listMyGroupOrders,getMyGroupOrder} from '../controllers/groupOrderController.js';

const r=Router();
r.use(requireAuth);
r.post('/',privateUpload.array('designFiles',5),createGroupOrder);
r.get('/mine',listMyGroupOrders);
r.get('/:id',getMyGroupOrder);
export default r;
