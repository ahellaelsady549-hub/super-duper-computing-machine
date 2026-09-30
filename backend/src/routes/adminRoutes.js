import {Router} from 'express';
import {requireAuth,requireAdmin} from '../middleware/auth.js';
import {
 dashboard,adminNotifications,markAdminNotification,products,createProduct,updateProduct,deleteProduct,
 categories,createCategory,updateCategory,deleteCategory,
 customers,orders,updateOrder,groupOrders,updateGroupOrder,
 quotes,createQuote,updateQuote,reviews,updateReview,faqs,createFaq,updateFaq,deleteFaq,gallery,createGallery,updateGallery,deleteGallery,experienceReviewsAdmin,updateExperienceReview
} from '../controllers/adminController.js';

const r=Router();
r.use(requireAuth,requireAdmin);

r.get('/dashboard',dashboard);
r.get('/notifications',adminNotifications);
r.patch('/notifications/:id/read',markAdminNotification);

r.get('/products',products); r.post('/products',createProduct); r.put('/products/:id',updateProduct); r.delete('/products/:id',deleteProduct);
r.get('/categories',categories); r.post('/categories',createCategory); r.put('/categories/:id',updateCategory); r.delete('/categories/:id',deleteCategory);
r.get('/customers',customers);
r.get('/orders',orders); r.put('/orders/:id',updateOrder);
r.get('/group-orders',groupOrders); r.put('/group-orders/:id',updateGroupOrder);
r.get('/quotes',quotes); r.post('/quotes',createQuote); r.put('/quotes/:id',updateQuote);
r.get('/reviews',reviews); r.put('/reviews/:id',updateReview);
r.get('/faqs',faqs); r.post('/faqs',createFaq); r.put('/faqs/:id',updateFaq); r.delete('/faqs/:id',deleteFaq);
r.get('/gallery',gallery); r.post('/gallery',createGallery); r.put('/gallery/:id',updateGallery); r.delete('/gallery/:id',deleteGallery);
r.get('/experience-reviews',experienceReviewsAdmin); r.put('/experience-reviews/:id',updateExperienceReview);

export default r;
