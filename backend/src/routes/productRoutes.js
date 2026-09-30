import {Router} from 'express';
import {listCategories,listProducts,getProduct} from '../controllers/productController.js';

const r=Router();
r.get('/categories',listCategories);
r.get('/products',listProducts);
r.get('/products/:id',getProduct);
export default r;
