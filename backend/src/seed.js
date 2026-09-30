import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {connectDB} from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Admin from './models/Admin.js';

await connectDB();

const categoriesData = [
  {nameAr:'أرواب التخرج', nameEn:'Graduation Gowns', slug:'graduation-gowns'},
  {nameAr:'تيشيرتات التخرج', nameEn:'Graduation T-Shirts', slug:'graduation-t-shirts'},
  {nameAr:'دروع التكريم', nameEn:'Awards & Shields', slug:'awards-shields'},
  {nameAr:'مستلزمات الحفلات', nameEn:'Graduation Supplies', slug:'graduation-supplies'}
];

const categories = [];
for (const data of categoriesData) {
  categories.push(
    await Category.findOneAndUpdate(
      {slug:data.slug},
      data,
      {upsert:true,new:true,setDefaultsOnInsert:true}
    )
  );
}

const gownImages={gold:'/products/gown-gold.jpg',red:'/products/gown-red.jpg',blue:'/products/gown-blue.jpg'};

const demoProducts = [
  {
    nameAr:'أرواب تخرج REFLECT – اختاري لونك',
    nameEn:'REFLECT Graduation Gowns – Pick Your Color',
    descriptionAr:'أرواب تخرج بألوان مختلفة تناسب الدفعة. اختاري اللون والمقاس وحددي تفاصيل الحفلة ومكانها.',
    descriptionEn:'Graduation gowns in multiple colors for your class. Pick the color and size, then add your event and delivery details.',
    category:categories[0]._id, price:850, salePrice:765, discountPercentage:10, stock:60, sku:'REFLECT-GOWN-COLORS-001',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:[
      {nameAr:'أسود وذهبي',nameEn:'Black & Gold',code:'#c9a24a',image:gownImages.gold},
      {nameAr:'أسود وأحمر',nameEn:'Black & Red',code:'#c83349',image:gownImages.red},
      {nameAr:'أسود وأزرق',nameEn:'Black & Blue',code:'#2874d8',image:gownImages.blue}
    ],
    featured:true, active:true, mainImage:gownImages.gold, gallery:[gownImages.gold,gownImages.red,gownImages.blue]
  },
  {
    nameAr:'روب تخرج REFLECT',
    nameEn:'REFLECT Graduation Gown',
    descriptionAr:'منتج تجريبي لاختبار المتجر. استبدليه ببيانات المنتج الحقيقية من لوحة الإدارة.',
    category:categories[0]._id,
    price:850,
    stock:25,
    sku:'DEMO-GOWN-001',
    sizes:['S','M','L','XL'],
    colors:[
      {nameAr:'كحلي',nameEn:'Navy',code:'#0b1f42'},
      {nameAr:'أسود',nameEn:'Black',code:'#111111'}
    ],
    featured:true,
    active:true,
    mainImage:'/reflect-logo.jpg'
  },
  {
    nameAr:'درع تخرج مخصص',
    nameEn:'Custom Graduation Shield',
    descriptionAr:'درع تخرج يمكن تخصيص النص المكتوب عليه باسم الخريج والدفعة.',
    descriptionEn:'A graduation shield with customizable engraving for the graduate and class.',
    category:categories[2]._id,
    productType:'shield',
    shieldTextLabelAr:'هتكتبي إيه على الدرع؟',
    shieldTextLabelEn:'What should be engraved on the shield?',
    price:600,
    stock:20,
    sku:'DEMO-SHIELD-001',
    colors:[{nameAr:'ذهبي',nameEn:'Gold',code:'#d7a84f'},{nameAr:'فضي',nameEn:'Silver',code:'#c9ced8'}],
    featured:true,
    active:true,
    mainImage:'/reflect-logo.png'
  },
  {
    nameAr:'تيشيرت تخرج مخصص',
    nameEn:'Custom Graduation T-Shirt',
    descriptionAr:'منتج تجريبي لاختبار اختيار المقاسات والألوان.',
    category:categories[1]._id,
    price:350,
    stock:40,
    sku:'DEMO-SHIRT-001',
    sizes:['S','M','L','XL','XXL'],
    colors:[
      {nameAr:'أبيض',nameEn:'White',code:'#ffffff'},
      {nameAr:'كحلي',nameEn:'Navy',code:'#0b1f42'}
    ],
    active:true,
    mainImage:'/reflect-logo.jpg'
  }
];

for (const product of demoProducts) {
  await Product.findOneAndUpdate(
    {sku:product.sku},
    product,
    {upsert:true,new:true,setDefaultsOnInsert:true}
  );
}

const adminEmail = process.env.ADMIN_EMAIL || 'reflect@gmail.com';
if (adminEmail && process.env.ADMIN_PASSWORD) {
  await Admin.findOneAndUpdate(
    {email:adminEmail},
    {
      email:adminEmail,
      password:await bcrypt.hash(process.env.ADMIN_PASSWORD,12),
      role:'admin'
    },
    {upsert:true,new:true,setDefaultsOnInsert:true}
  );
}

console.log('Phase 2 seed completed.');
console.log('Demo catalog records are clearly marked with DEMO SKUs.');
process.exit(0);
