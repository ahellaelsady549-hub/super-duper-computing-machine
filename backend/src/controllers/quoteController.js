import QuoteRequest from '../models/QuoteRequest.js';

export async function listMyQuotes(req,res,next){
 try{
   const quotes=await QuoteRequest.find({customer:req.user.id})
     .populate('groupOrder')
     .sort({createdAt:-1});
   res.json(quotes);
 }catch(e){next(e)}
}

export async function getMyQuote(req,res,next){
 try{
   const quote=await QuoteRequest.findOne({_id:req.params.id,customer:req.user.id}).populate('groupOrder');
   if(!quote)return res.status(404).json({message:'Quote not found'});
   res.json(quote);
 }catch(e){next(e)}
}

export async function respondToQuote(req,res,next){
 try{
   const {action,message}=req.body;
   if(!['approved','rejected'].includes(action))
     return res.status(400).json({message:'Invalid quote response'});
   const quote=await QuoteRequest.findOne({_id:req.params.id,customer:req.user.id});
   if(!quote)return res.status(404).json({message:'Quote not found'});
   if(quote.status!=='quote_sent')return res.status(400).json({message:'Quote is not awaiting a response'});
   quote.status=action;
   quote.customerResponse=message||'';
   await quote.save();
   res.json(quote);
 }catch(e){next(e)}
}
