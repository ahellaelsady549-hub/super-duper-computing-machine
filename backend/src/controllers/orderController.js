import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AdminNotification from '../models/AdminNotification.js';

function makeOrderNumber(sequence){ return `REF-${new Date().getFullYear()}-${String(sequence).padStart(4,'0')}`; }
async function nextOrderNumber(){
  const year=new Date().getFullYear();
  const count=await Order.countDocuments({createdAt:{$gte:new Date(`${year}-01-01T00:00:00.000Z`)}});
  return makeOrderNumber(count+1);
}

export async function createOrder(req,res,next){
 try{
  const {items,customerInfo,paymentStatus='successful',transactionId,paymentMethod='paymob_mock',bankName,transferReference,customization={}}=req.body;
  const allowedMethods=['paymob_mock','fawry_mock','bank_transfer'];
  if(!allowedMethods.includes(paymentMethod)) return res.status(400).json({message:'Invalid payment method'});
  if(paymentMethod==='bank_transfer' && !bankName) return res.status(400).json({message:'Please select a bank'});
  if(!Array.isArray(items)||!items.length) return res.status(400).json({message:'Cart is empty'});
  if(!customerInfo?.fullName||!customerInfo?.phone||!customerInfo?.address) return res.status(400).json({message:'Full name, phone and address are required'});

  const totalStudents=Number(customization.totalStudents||0), boys=Number(customization.boys||0), girls=Number(customization.girls||0);
  if(boys+girls>totalStudents) return res.status(400).json({message:'Boys and girls count cannot exceed total students'});

  let subtotal=0; const normalized=[];
  for(const item of items){
    const product=await Product.findById(item.productId);
    if(!product||!product.active) return res.status(400).json({message:'A product is unavailable'});
    const quantity=Number(item.quantity);
    if(!Number.isInteger(quantity)||quantity<1) return res.status(400).json({message:'Invalid quantity'});
    if(paymentMethod!=='bank_transfer' && product.stock<quantity) return res.status(400).json({message:`Insufficient stock for ${product.nameAr}`});
    const selectedColor=product.colors?.id(item.colorId);
    if(product.colors?.length && !selectedColor) return res.status(400).json({message:`Select a valid color for ${product.nameAr}`});
    if(product.sizes?.length && !product.sizes.includes(item.size)) return res.status(400).json({message:`Select a valid size for ${product.nameAr}`});
    const unitPrice=product.salePrice ?? product.price ?? 0; const lineTotal=unitPrice*quantity; subtotal+=lineTotal;
    normalized.push({product:product._id,productName:product.nameAr,image:item.image||selectedColor?.image||product.mainImage,colorId:selectedColor?._id?.toString(),colorName:selectedColor?.nameAr,size:item.size,quantity,unitPrice,subtotal:lineTotal,customization:{shieldText:item.customization?.shieldText||'',studentCount:Number(item.customization?.totalStudents||0),boys:Number(item.customization?.boys||0),girls:Number(item.customization?.girls||0),sizeBreakdown:Array.isArray(item.customization?.sizeBreakdown)?item.customization.sizeBreakdown:[],eventDate:item.customization?.eventDate||undefined,address:item.customization?.address||'',mapUrl:item.customization?.mapUrl||''}});
  }

  const order=await Order.create({
    orderNumber:await nextOrderNumber(),customer:req.user.id,items:normalized,customerInfo,customization:{totalStudents,boys,girls,sizeBreakdown:Array.isArray(customization.sizeBreakdown)?customization.sizeBreakdown:[],eventDate:customization.eventDate||undefined,mapUrl:customization.mapUrl||'',notes:customization.notes||''},subtotal,total:subtotal,
    payment:{method:paymentMethod,status:paymentMethod==='bank_transfer'?'pending':paymentStatus,transactionId,bankName,transferReference,paidAt:paymentStatus==='successful'?new Date():undefined},
    status:paymentMethod!=='bank_transfer' && paymentStatus==='successful'?'paid':'new'
  });
  if(paymentMethod!=='bank_transfer' && paymentStatus==='successful'){
    for(const item of normalized) await Product.findByIdAndUpdate(item.product,{$inc:{stock:-item.quantity}});
    order.inventoryAdjusted=true; await order.save();
  }
  await AdminNotification.create({title:'طلب جديد',message:`وصل طلب جديد ${order.orderNumber} بقيمة ${order.total} ج.م`,type:'order',order:order._id});
  res.status(201).json(order);
 }catch(e){next(e)}
}

export async function listMyOrders(req,res,next){try{res.json(await Order.find({customer:req.user.id}).sort({createdAt:-1}))}catch(e){next(e)}}
export async function getMyOrder(req,res,next){try{const order=await Order.findOne({_id:req.params.id,customer:req.user.id}).populate('items.product');if(!order)return res.status(404).json({message:'Order not found'});res.json(order)}catch(e){next(e)}}
