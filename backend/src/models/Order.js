import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref:'Product', required:true},
  productName: {type:String, required:true},
  image: String,
  colorId: String,
  colorName: String,
  size: String,
  quantity: {type:Number, required:true, min:1},
  unitPrice: {type:Number, required:true, min:0},
  customization: {shieldText:String,studentCount:Number,boys:Number,girls:Number,sizeBreakdown:[{size:String,quantity:Number}],eventDate:Date,address:String,mapUrl:String},
  subtotal: {type:Number, required:true, min:0}
},{_id:false});

const orderSchema = new mongoose.Schema({
  orderNumber: {type:String, unique:true, index:true},
  customer: {type:mongoose.Schema.Types.ObjectId, ref:'Customer', required:true, index:true},
  items: {type:[orderItemSchema], required:true},
  customerInfo: {
    fullName:String, phone:String, whatsapp:String,
    address:String, deliveryNotes:String
  },
  customization: {totalStudents:Number,boys:Number,girls:Number,sizeBreakdown:[{size:String,quantity:Number}],eventDate:Date,mapUrl:String,notes:String},
  subtotal: {type:Number, required:true},
  discount: {type:Number, default:0},
  total: {type:Number, required:true},
  payment: {
    method:{type:String, enum:['paymob_mock','fawry_mock','bank_transfer'], default:'paymob_mock'},
    bankName:String,
    transferReference:String,
    status:{type:String, enum:['pending','successful','failed','cancelled'], default:'pending'},
    transactionId:String,
    paidAt:Date
  },
  shippingLocation: {type:String,default:''},
  status: {
    type:String,
    enum:['new','paid','processing','shipped','ready','delivered','cancelled'],
    default:'new',
    index:true
  },
  inventoryAdjusted:{type:Boolean,default:false},
  notes:String
},{timestamps:true});

export default mongoose.model('Order',orderSchema);
