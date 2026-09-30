import bcrypt from 'bcryptjs';
import Customer from '../models/Customer.js';

export async function getProfile(req,res,next){
  try{
    const user=await Customer.findById(req.user.id);
    if(!user)return res.status(404).json({message:'Customer not found'});
    res.json(user);
  }catch(e){next(e)}
}

export async function updateProfile(req,res,next){
  try{
    const allowed=['fullName','phone','whatsapp','university','faculty','department'];
    const updates={};
    for(const key of allowed) if(req.body[key]!==undefined) updates[key]=req.body[key];
    const user=await Customer.findByIdAndUpdate(req.user.id,updates,{new:true,runValidators:true});
    res.json(user);
  }catch(e){next(e)}
}

export async function changePassword(req,res,next){
  try{
    const {currentPassword,newPassword}=req.body;
    if(!currentPassword||!newPassword||newPassword.length<8)
      return res.status(400).json({message:'Current password and a new password of at least 8 characters are required'});
    const user=await Customer.findById(req.user.id).select('+password');
    if(!user)return res.status(404).json({message:'Customer not found'});
    if(!(await bcrypt.compare(currentPassword,user.password)))
      return res.status(400).json({message:'Current password is incorrect'});
    user.password=await bcrypt.hash(newPassword,12);
    await user.save();
    res.json({message:'Password changed successfully'});
  }catch(e){next(e)}
}
