import rateLimit from 'express-rate-limit';
export const authLimiter=rateLimit({windowMs:15*60*1000,limit:12,standardHeaders:true,legacyHeaders:false,message:{message:'Too many login attempts. Please try again later.'}});
export const reviewLimiter=rateLimit({windowMs:10*60*1000,limit:20,standardHeaders:true,legacyHeaders:false,message:{message:'Too many review requests. Please try again later.'}});
