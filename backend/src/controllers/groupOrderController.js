import path from 'path';
import GroupOrder from '../models/GroupOrder.js';
import Product from '../models/Product.js';

async function nextRequestNumber(){
 const year=new Date().getFullYear();
 const count=await GroupOrder.countDocuments({createdAt:{$gte:new Date(`${year}-01-01T00:00:00.000Z`)}});
 return `GRP-${year}-${String(count+1).padStart(4,'0')}`;
}

export async function createGroupOrder(req,res,next){
 try{
   const body=JSON.parse(req.body.payload||'{}');
   const {representativeName,phone,whatsapp,university,faculty,department,studentCount,graduationDate,requiredDeliveryDate,products,customizationDetails,notes,estimatedBudget}=body;

   if(!representativeName||!phone||!university||!studentCount)
     return res.status(400).json({message:'Representative name, phone, university and student count are required'});

   if(Number(studentCount)<1) return res.status(400).json({message:'Student count must be at least 1'});

   const productRows=[];
   for(const item of (Array.isArray(products)?products:[])){
     const product=await Product.findById(item.productId);
     if(!product||!product.active) continue;
     productRows.push({
       product:product._id,
       productName:product.nameAr,
       quantity:Number(item.quantity)||1,
       sizes:Array.isArray(item.sizes)?item.sizes:[],
       colors:Array.isArray(item.colors)?item.colors:[]
     });
   }

   const files=(req.files||[]).map(file=>({
     originalName:file.originalname,
     storedName:file.filename,
     path:file.path,
     mimeType:file.mimetype,
     size:file.size
   }));

   const groupOrder=await GroupOrder.create({
     requestNumber:await nextRequestNumber(),
     customer:req.user.id,
     representativeName,phone,whatsapp,university,faculty,department,
     studentCount:Number(studentCount),
     graduationDate,requiredDeliveryDate,
     products:productRows,
     customizationDetails,
     designFiles:files,
     notes,
     estimatedBudget:Number(estimatedBudget)||undefined
   });

   res.status(201).json(groupOrder);
 }catch(e){next(e)}
}

export async function listMyGroupOrders(req,res,next){
 try{
   const rows=await GroupOrder.find({customer:req.user.id}).sort({createdAt:-1});
   res.json(rows);
 }catch(e){next(e)}
}

export async function getMyGroupOrder(req,res,next){
 try{
   const row=await GroupOrder.findOne({_id:req.params.id,customer:req.user.id});
   if(!row)return res.status(404).json({message:'Group request not found'});
   res.json(row);
 }catch(e){next(e)}
}
