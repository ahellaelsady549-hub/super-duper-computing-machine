import mongoose from 'mongoose';
const gallerySchema=new mongoose.Schema({titleAr:String,titleEn:String,image:{type:String,required:true},category:String,active:{type:Boolean,default:true},sortOrder:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('GalleryItem',gallerySchema);
