import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Faq from '../models/Faq.js';
import GalleryItem from '../models/GalleryItem.js';
import mongoose from 'mongoose';

export async function productReviews(req,res,next){try{const reviews=await Review.find({product:req.params.productId,status:'approved'}).populate('customer','fullName').sort({createdAt:-1});const stats=await Review.aggregate([{$match:{product:new mongoose.Types.ObjectId(req.params.productId),status:'approved'}},{$group:{_id:null,average:{$avg:'$rating'},count:{$sum:1}}}]).catch(()=>[]);res.json({reviews,summary:{average:stats[0]?.average||0,count:stats[0]?.count||0}})}catch(e){next(e)}}
export async function createReview(req,res,next){try{const {rating,title,comment}=req.body;if(!rating||!comment)return res.status(400).json({message:'Rating and comment are required'});const review=await Review.create({product:req.params.productId,customer:req.user.id,rating:Number(rating),title,comment});res.status(201).json(review)}catch(e){if(e.code===11000)return res.status(409).json({message:'You already reviewed this product'});next(e)}}
export async function mineReviews(req,res,next){try{res.json(await Review.find({customer:req.user.id}).populate('product','nameAr mainImage').sort({createdAt:-1}))}catch(e){next(e)}}
export async function notifications(req,res,next){try{res.json(await Notification.find({customer:req.user.id}).sort({createdAt:-1}).limit(50))}catch(e){next(e)}}
export async function markNotification(req,res,next){try{const n=await Notification.findOneAndUpdate({_id:req.params.id,customer:req.user.id},{read:true},{new:true});if(!n)return res.status(404).json({message:'Notification not found'});res.json(n)}catch(e){next(e)}}
export async function faqs(req,res,next){try{res.json(await Faq.find({active:true}).sort({sortOrder:1,createdAt:1}))}catch(e){next(e)}}
export async function gallery(req,res,next){try{res.json(await GalleryItem.find({active:true}).sort({sortOrder:1,createdAt:-1}))}catch(e){next(e)}}

import ExperienceReview from '../models/ExperienceReview.js';
export async function experienceReviews(req,res,next){try{const reviews=await ExperienceReview.find({status:'approved'}).populate('customer','fullName').sort({createdAt:-1}).limit(30);const stats=await ExperienceReview.aggregate([{$match:{status:'approved'}},{$group:{_id:null,average:{$avg:'$rating'},count:{$sum:1}}}]);res.json({reviews,summary:{average:stats[0]?.average||0,count:stats[0]?.count||0}})}catch(e){next(e)}}
export async function createExperienceReview(req,res,next){try{const {rating,message}=req.body;if(!rating||!message?.trim())return res.status(400).json({message:'Rating and message are required'});const review=await ExperienceReview.create({customer:req.user.id,rating:Number(rating),message:message.trim()});res.status(201).json(review)}catch(e){next(e)}}
