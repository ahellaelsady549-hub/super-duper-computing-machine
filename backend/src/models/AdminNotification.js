import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  title:{type:String,required:true},
  message:{type:String,required:true},
  type:{type:String,enum:['order','payment','group','system'],default:'system'},
  order:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
  read:{type:Boolean,default:false},
  createdAt:{type:Date,default:Date.now}
});
export default mongoose.model('AdminNotification',schema);
