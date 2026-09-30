import mongoose from 'mongoose';
const notificationSchema=new mongoose.Schema({customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer',required:true,index:true},title:{type:String,required:true},message:{type:String,required:true},type:{type:String,enum:['order','group','quote','general'],default:'general'},link:String,read:{type:Boolean,default:false},createdAt:{type:Date,default:Date.now}});
export default mongoose.model('Notification',notificationSchema);
