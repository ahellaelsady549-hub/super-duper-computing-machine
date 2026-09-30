import mongoose from 'mongoose';
const faqSchema=new mongoose.Schema({questionAr:{type:String,required:true},answerAr:{type:String,required:true},questionEn:String,answerEn:String,active:{type:Boolean,default:true},sortOrder:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Faq',faqSchema);
