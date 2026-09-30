import mongoose from 'mongoose';
const schema=new mongoose.Schema({nameAr:{type:String,required:true},nameEn:{type:String,required:true},slug:{type:String,unique:true,index:true},active:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Category',schema);
