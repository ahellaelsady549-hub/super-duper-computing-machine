import mongoose from 'mongoose';
const customerSchema=new mongoose.Schema({
 fullName:{type:String,required:true,trim:true},
 email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
 password:{type:String,required:true,select:false},
 phone:{type:String,trim:true,index:true}, whatsapp:String,
 university:String, faculty:String, department:String,
 role:{type:String,default:'customer',enum:['customer']}
},{timestamps:true});
export default mongoose.model('Customer',customerSchema);
