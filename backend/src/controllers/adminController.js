import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import GroupOrder from '../models/GroupOrder.js';
import QuoteRequest from '../models/QuoteRequest.js';
import Notification from '../models/Notification.js';
import AdminNotification from '../models/AdminNotification.js';

const clean=body=>{
 const allowed=['nameAr','nameEn','descriptionAr','descriptionEn','mainImage','gallery','category','price','salePrice','discountPercentage','sizes','colors','customizationOptions','stock','sku','featured','active','productType','shieldTextLabelAr','shieldTextLabelEn'];
 const out={}; for(const k of allowed) if(body[k]!==undefined) out[k]=body[k]; if(out.discountPercentage!==undefined && out.price!==undefined && out.discountPercentage!==''){ const pct=Math.max(0,Math.min(100,Number(out.discountPercentage))); out.discountPercentage=pct; out.salePrice=Number((Number(out.price)*(1-pct/100)).toFixed(2)); } return out;
};

export async function dashboard(req,res,next){
 try{
  const [customers,products,orders,groups,quotes,revenue]=await Promise.all([
   Customer.countDocuments(),Product.countDocuments(),Order.countDocuments(),
   GroupOrder.countDocuments(),QuoteRequest.countDocuments(),
   Order.aggregate([{$match:{'payment.status':'successful'}},{$group:{_id:null,total:{$sum:'$total'}}}])
  ]);
  const recentOrders=await Order.find().populate('customer','fullName email').sort({createdAt:-1}).limit(8).select('orderNumber total status payment createdAt customer');
  const recentGroups=await GroupOrder.find().populate('customer','fullName email').sort({createdAt:-1}).limit(8).select('requestNumber university faculty studentCount status createdAt customer');
  res.json({stats:{customers,products,orders,groups,quotes,revenue:revenue[0]?.total||0},recentOrders,recentGroups});
 }catch(e){next(e)}
}

export async function products(req,res,next){
 try{res.json(await Product.find().populate('category').sort({createdAt:-1}))}catch(e){next(e)}
}
export async function createProduct(req,res,next){
 try{const product=await Product.create(clean(req.body));res.status(201).json(await product.populate('category'))}catch(e){next(e)}
}
export async function updateProduct(req,res,next){
 try{const product=await Product.findByIdAndUpdate(req.params.id,clean(req.body),{new:true,runValidators:true}).populate('category');if(!product)return res.status(404).json({message:'Product not found'});res.json(product)}catch(e){next(e)}
}
export async function deleteProduct(req,res,next){
 try{const product=await Product.findByIdAndDelete(req.params.id);if(!product)return res.status(404).json({message:'Product not found'});res.json({message:'Product deleted'})}catch(e){next(e)}
}

export async function categories(req,res,next){
 try{res.json(await Category.find().sort({nameEn:1}))}catch(e){next(e)}
}
export async function createCategory(req,res,next){
 try{const c=await Category.create(req.body);res.status(201).json(c)}catch(e){next(e)}
}
export async function updateCategory(req,res,next){
 try{const c=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!c)return res.status(404).json({message:'Category not found'});res.json(c)}catch(e){next(e)}
}
export async function deleteCategory(req,res,next){
 try{const c=await Category.findByIdAndDelete(req.params.id);if(!c)return res.status(404).json({message:'Category not found'});res.json({message:'Category deleted'})}catch(e){next(e)}
}

export async function customers(req,res,next){
 try{res.json(await Customer.find().select('-password').sort({createdAt:-1}))}catch(e){next(e)}
}
export async function orders(req,res,next){
 try{res.json(await Order.find().populate('customer','fullName email phone').sort({createdAt:-1}))}catch(e){next(e)}
}
export async function updateOrder(req,res,next){
 try{
  const before=await Order.findById(req.params.id);
  if(!before)return res.status(404).json({message:'Order not found'});
  const update={};
  if(req.body.status) update.status=req.body.status;
  if(req.body.shippingLocation!==undefined) update.shippingLocation=req.body.shippingLocation;
  if(req.body.paymentStatus) update['payment.status']=req.body.paymentStatus;
  if(req.body.paymentStatus==='successful') update['payment.paidAt']=before.payment?.paidAt||new Date();
  const order=await Order.findByIdAndUpdate(req.params.id,update,{new:true,runValidators:true});
  if(req.body.paymentStatus==='successful' && !before.inventoryAdjusted){
    for(const item of order.items) await Product.findByIdAndUpdate(item.product,{$inc:{stock:-item.quantity}});
    order.inventoryAdjusted=true; await order.save();
  }
  if(req.body.status && req.body.status!==before.status){
    const labels={new:'تم استلام طلبك',paid:'تم تأكيد الدفع',processing:'طلبك قيد التجهيز',shipped:'طلبك في الشحن',ready:'طلبك جاهز',delivered:'تم التسليم',cancelled:'تم إلغاء الطلب'};
    await Notification.create({customer:order.customer,title:labels[order.status]||'تحديث على طلبك',message:`حالة الطلب ${order.orderNumber}: ${labels[order.status]||order.status}`,type:'order',link:`order:${order._id}`});
  }
  res.json(order);
 }catch(e){next(e)}
}
export async function groupOrders(req,res,next){
 try{res.json(await GroupOrder.find().populate('customer','fullName email phone').sort({createdAt:-1}))}catch(e){next(e)}
}
export async function updateGroupOrder(req,res,next){
 try{
  const before=await GroupOrder.findById(req.params.id); if(!before)return res.status(404).json({message:'Group order not found'});
  const group=await GroupOrder.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true});
  if(req.body.status&&req.body.status!==before.status){await Notification.create({customer:group.customer,title:'تحديث على طلب الدفعة',message:`حالة طلب الدفعة ${group.requestNumber}: ${req.body.status}`,type:'group',link:`group:${group._id}`})}
  res.json(group);
 }catch(e){next(e)}
}

async function nextQuoteNumber(){
 const year=new Date().getFullYear();
 const count=await QuoteRequest.countDocuments({createdAt:{$gte:new Date(`${year}-01-01T00:00:00.000Z`)}});
 return `QUO-${year}-${String(count+1).padStart(4,'0')}`;
}
export async function quotes(req,res,next){
 try{res.json(await QuoteRequest.find().populate('customer','fullName email phone').populate('groupOrder','requestNumber university studentCount').sort({createdAt:-1}))}catch(e){next(e)}
}
export async function createQuote(req,res,next){
 try{
  const {groupOrderId,proposedPrice,details,expiresAt,items=[]}=req.body;
  const group=await GroupOrder.findById(groupOrderId);
  if(!group)return res.status(404).json({message:'Group order not found'});
  const quote=await QuoteRequest.create({
   quoteNumber:await nextQuoteNumber(),groupOrder:group._id,customer:group.customer,
   proposedPrice:Number(proposedPrice),details,expiresAt,
   items:Array.isArray(items)?items:[],status:'quote_sent'
  });
  group.status='quote_sent';await group.save();
  res.status(201).json(await quote.populate('customer','fullName email phone'));
 }catch(e){next(e)}
}
export async function updateQuote(req,res,next){
 try{
  const quote=await QuoteRequest.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  if(!quote)return res.status(404).json({message:'Quote not found'});res.json(quote);
 }catch(e){next(e)}
}

import Review from '../models/Review.js';
import Faq from '../models/Faq.js';
import GalleryItem from '../models/GalleryItem.js';
export async function reviews(req,res,next){try{res.json(await Review.find().populate('customer','fullName email').populate('product','nameAr').sort({createdAt:-1}))}catch(e){next(e)}}
export async function updateReview(req,res,next){try{const r=await Review.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true});if(!r)return res.status(404).json({message:'Review not found'});res.json(r)}catch(e){next(e)}}
export async function faqs(req,res,next){try{res.json(await Faq.find().sort({sortOrder:1,createdAt:-1}))}catch(e){next(e)}}
export async function createFaq(req,res,next){try{res.status(201).json(await Faq.create(req.body))}catch(e){next(e)}}
export async function updateFaq(req,res,next){try{const x=await Faq.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!x)return res.status(404).json({message:'FAQ not found'});res.json(x)}catch(e){next(e)}}
export async function deleteFaq(req,res,next){try{await Faq.findByIdAndDelete(req.params.id);res.json({message:'FAQ deleted'})}catch(e){next(e)}}
export async function gallery(req,res,next){try{res.json(await GalleryItem.find().sort({sortOrder:1,createdAt:-1}))}catch(e){next(e)}}
export async function createGallery(req,res,next){try{res.status(201).json(await GalleryItem.create(req.body))}catch(e){next(e)}}
export async function updateGallery(req,res,next){try{const x=await GalleryItem.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!x)return res.status(404).json({message:'Gallery item not found'});res.json(x)}catch(e){next(e)}}
export async function deleteGallery(req,res,next){try{await GalleryItem.findByIdAndDelete(req.params.id);res.json({message:'Gallery item deleted'})}catch(e){next(e)}}

export async function adminNotifications(req,res,next){try{res.json(await AdminNotification.find().populate('order','orderNumber total status customerInfo').sort({createdAt:-1}).limit(50))}catch(e){next(e)}}
export async function markAdminNotification(req,res,next){try{const n=await AdminNotification.findByIdAndUpdate(req.params.id,{read:true},{new:true});if(!n)return res.status(404).json({message:'Notification not found'});res.json(n)}catch(e){next(e)}}

import ExperienceReview from '../models/ExperienceReview.js';
export async function experienceReviewsAdmin(req,res,next){try{res.json(await ExperienceReview.find().populate('customer','fullName email').sort({createdAt:-1}))}catch(e){next(e)}}
export async function updateExperienceReview(req,res,next){try{const r=await ExperienceReview.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true});if(!r)return res.status(404).json({message:'Experience review not found'});res.json(r)}catch(e){next(e)}}
