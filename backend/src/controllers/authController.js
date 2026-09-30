import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import Customer from '../models/Customer.js'; import Admin from '../models/Admin.js';
const tokenFor=(u)=>jwt.sign({id:u._id.toString(),role:u.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'});
const emailOf=(v)=>String(v||'').trim().toLowerCase();
const strongEnough=(v)=>typeof v==='string'&&v.length>=8&&v.length<=128;
export async function register(req,res,next){try{
 const {fullName,email,password,phone,whatsapp,university,faculty,department}=req.body;
 const normalizedEmail=emailOf(email);
 if(!fullName||!normalizedEmail||!password) return res.status(400).json({message:'Name, email and password are required'});
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({message:'Please enter a valid email'});
 if(!strongEnough(password)) return res.status(400).json({message:'Password must be at least 8 characters'});
 if(await Customer.findOne({email:normalizedEmail})) return res.status(409).json({message:'Email already exists'});
 const user=await Customer.create({fullName:String(fullName).trim().slice(0,120),email:normalizedEmail,password:await bcrypt.hash(password,12),phone,whatsapp,university,faculty,department});
 res.status(201).json({token:tokenFor(user),user:{id:user._id,fullName:user.fullName,email:user.email,role:user.role}});
}catch(e){next(e)}}
export async function login(req,res,next){try{
 const user=await Customer.findOne({email:emailOf(req.body.email)}).select('+password');
 if(!user||!(await bcrypt.compare(req.body.password||'',user.password))) return res.status(401).json({message:'Invalid credentials'});
 res.json({token:tokenFor(user),user:{id:user._id,fullName:user.fullName,email:user.email,role:user.role}});
}catch(e){next(e)}}
export async function adminLogin(req,res,next){try{
 const admin=await Admin.findOne({email:emailOf(req.body.email)}).select('+password');
 if(!admin||!(await bcrypt.compare(req.body.password||'',admin.password))) return res.status(401).json({message:'Invalid credentials'});
 res.json({token:tokenFor(admin),user:{id:admin._id,email:admin.email,role:'admin'}});
}catch(e){next(e)}}
