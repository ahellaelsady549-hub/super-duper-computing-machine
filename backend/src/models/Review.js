import mongoose from 'mongoose';
const reviewSchema=new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true,index:true},customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer',required:true},rating:{type:Number,min:1,max:5,required:true},title:String,comment:{type:String,required:true,maxlength:1000},status:{type:String,enum:['pending','approved','rejected'],default:'pending',index:true}},{timestamps:true});
reviewSchema.index({product:1,customer:1},{unique:true});
export default mongoose.model('Review',reviewSchema);
