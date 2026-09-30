import mongoose from 'mongoose';
const adminSchema=new mongoose.Schema({
 email:{type:String,required:true,unique:true,lowercase:true,index:true},
 password:{type:String,required:true,select:false},
 role:{type:String,default:'admin',enum:['admin']}
},{timestamps:true});
export default mongoose.model('Admin',adminSchema);
