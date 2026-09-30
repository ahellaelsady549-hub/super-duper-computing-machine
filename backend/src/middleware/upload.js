import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir=path.resolve('uploads/private-designs');
fs.mkdirSync(uploadDir,{recursive:true});

const allowed=new Set([
 'image/jpeg','image/png','image/webp','application/pdf'
]);

const storage=multer.diskStorage({
 destination:(req,file,cb)=>cb(null,uploadDir),
 filename:(req,file,cb)=>{
   const ext=path.extname(file.originalname).toLowerCase();
   cb(null,`${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
 }
});

const fileFilter=(req,file,cb)=>{
 if(!allowed.has(file.mimetype)) return cb(new Error('Only JPG, PNG, WEBP and PDF files are allowed'));
 cb(null,true);
};

export const privateUpload=multer({
 storage,fileFilter,
 limits:{fileSize:10*1024*1024,files:5}
});
