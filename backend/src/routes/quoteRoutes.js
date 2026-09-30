import {Router} from 'express';
import {requireAuth} from '../middleware/auth.js';
import {listMyQuotes,getMyQuote,respondToQuote} from '../controllers/quoteController.js';

const r=Router();
r.use(requireAuth);
r.get('/mine',listMyQuotes);
r.get('/:id',getMyQuote);
r.post('/:id/respond',respondToQuote);
export default r;
