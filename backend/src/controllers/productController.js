import Product from '../models/Product.js';
import Category from '../models/Category.js';

export async function listCategories(req,res,next){
  try {
    const categories = await Category.find({active:true}).sort({nameEn:1});
    res.json(categories);
  } catch(e){ next(e); }
}

export async function listProducts(req,res,next){
  try {
    const {category, featured, search} = req.query;
    const filter = {active:true};
    if(category) filter.category = category;
    if(featured === 'true') filter.featured = true;
    if(search) filter.$or = [
      {nameAr:{$regex:search,$options:'i'}},
      {nameEn:{$regex:search,$options:'i'}}
    ];
    const products = await Product.find(filter).populate('category').sort({createdAt:-1});
    res.json(products);
  } catch(e){ next(e); }
}

export async function getProduct(req,res,next){
  try {
    const product = await Product.findOne({_id:req.params.id,active:true}).populate('category');
    if(!product) return res.status(404).json({message:'Product not found'});
    res.json(product);
  } catch(e){ next(e); }
}
