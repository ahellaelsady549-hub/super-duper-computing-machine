import mongoose from 'mongoose';
const colorSchema=new mongoose.Schema({nameAr:String,nameEn:String,code:String,image:String},{_id:true});
const schema=new mongoose.Schema({
 nameAr:{type:String,required:true},nameEn:{type:String,required:true},
 descriptionAr:String,descriptionEn:String,mainImage:String,gallery:[String],
 category:{type:mongoose.Schema.Types.ObjectId,ref:'Category',index:true},
 price:Number,salePrice:Number,discountPercentage:Number,sizes:[String],colors:[colorSchema],
 customizationOptions:[String],stock:{type:Number,default:0},sku:{type:String,unique:true,sparse:true,index:true},
 featured:{type:Boolean,default:false},active:{type:Boolean,default:true},
 productType:{type:String,enum:['apparel','shield','accessory','other'],default:'apparel'},
 shieldTextLabelAr:{type:String,default:'النص المطلوب على الدرع'},
 shieldTextLabelEn:{type:String,default:'Text to engrave on the shield'}
},{timestamps:true});
export default mongoose.model('Product',schema);
