import mongoose from 'mongoose';

const groupOrderSchema=new mongoose.Schema({
 requestNumber:{type:String,unique:true,index:true},
 customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer',required:true,index:true},
 representativeName:{type:String,required:true},
 phone:{type:String,required:true},
 whatsapp:String,
 university:{type:String,required:true},
 faculty:String,
 department:String,
 studentCount:{type:Number,required:true,min:1},
 graduationDate:Date,
 requiredDeliveryDate:Date,
 products:[{
   product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
   productName:String,
   quantity:Number,
   sizes:[{size:String,quantity:Number}],
   colors:[{color:String,quantity:Number}]
 }],
 customizationDetails:String,
 designFiles:[{
   originalName:String,
   storedName:String,
   path:String,
   mimeType:String,
   size:Number
 }],
 notes:String,
 estimatedBudget:Number,
 status:{
   type:String,
   enum:['new','contacted','negotiating','quote_sent','approved','processing','ready','delivered','rejected','cancelled'],
   default:'new',
   index:true
 }
},{timestamps:true});

export default mongoose.model('GroupOrder',groupOrderSchema);
