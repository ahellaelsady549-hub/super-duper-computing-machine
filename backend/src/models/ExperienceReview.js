import mongoose from 'mongoose';
const schema=new mongoose.Schema({customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer'},rating:{type:Number,min:1,max:5,required:true},message:{type:String,required:true,maxlength:1000},status:{type:String,enum:['pending','approved','hidden','rejected'],default:'pending',index:true}},{timestamps:true});
export default mongoose.model('ExperienceReview',schema);
