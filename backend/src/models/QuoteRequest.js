import mongoose from 'mongoose';

const quoteItemSchema=new mongoose.Schema({
 description:String,
 quantity:{type:Number,default:1},
 unitPrice:{type:Number,default:0},
 total:{type:Number,default:0}
},{_id:true});

const quoteSchema=new mongoose.Schema({
 quoteNumber:{type:String,unique:true,index:true},
 groupOrder:{type:mongoose.Schema.Types.ObjectId,ref:'GroupOrder',required:true,index:true},
 customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer',required:true,index:true},
 items:[quoteItemSchema],
 proposedPrice:{type:Number,required:true,min:0},
 details:String,
 expiresAt:Date,
 status:{
   type:String,
   enum:['new','contacted','quote_sent','approved','rejected','expired'],
   default:'new',
   index:true
 },
 adminNotes:String,
 customerResponse:String
},{timestamps:true});

export default mongoose.model('QuoteRequest',quoteSchema);
