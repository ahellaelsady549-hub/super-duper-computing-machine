import React,{useState} from 'react';
import {ArrowRight,Upload,Users,CheckCircle2,Plus,Trash2} from 'lucide-react';
import {groupOrderApi} from '../services/api.js';
import {useAuth} from '../context/AuthContext.jsx';
import {useLanguage} from '../context/LanguageContext.jsx';

export default function GroupOrderPage({onLogin,onSuccess}){
 const {isAuthenticated}=useAuth(); const {isArabic}=useLanguage();
 const [form,setForm]=useState({
   representativeName:'',phone:'',whatsapp:'',university:'',faculty:'',department:'',
   studentCount:'',graduationDate:'',requiredDeliveryDate:'',customizationDetails:'',notes:'',estimatedBudget:''
 });
 const [products,setProducts]=useState([]);
 const [files,setFiles]=useState([]);
 const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [done,setDone]=useState(null);
 const update=e=>setForm({...form,[e.target.name]:e.target.value});
 if(!isAuthenticated)return <section className="group-page"><div className="login-required"><Users size={45}/><h2>{isArabic?'تسجيل الدخول مطلوب':'Sign in required'}</h2><p>{isArabic?'«جهز دفعتك» مخصص للعملاء المسجلين حتى نتمكن من حفظ الطلب ومتابعته.':'“Plan your group” is available to signed-in customers so we can save and track the request.'}</p><button className="primary" onClick={onLogin}>{isArabic?'تسجيل الدخول':'Sign in'}</button></div></section>;
 if(done)return <section className="group-page"><div className="success-box"><CheckCircle2 size={60}/><span className="eyebrow">GROUP REQUEST RECEIVED</span><h1>{isArabic?'تم استلام طلب تجهيز الدفعة':'Your group request is in'}</h1><p>{isArabic?'رقم الطلب:':'Request number:'}</p><strong>{done.requestNumber}</strong><p className="muted">{isArabic?'سيتم مراجعة التفاصيل والتواصل معك لإنشاء العرض.':'We’ll review the details and contact you with a quote.'}</p><button className="primary" onClick={onSuccess}>{isArabic?'الانتقال للحساب':'Go to my account'}</button></div></section>;

 const addProduct=()=>setProducts([...products,{productId:'',quantity:1,sizes:'',colors:''}]);
 const removeProduct=i=>setProducts(products.filter((_,idx)=>idx!==i));
 const changeProduct=(i,key,value)=>setProducts(products.map((p,idx)=>idx===i?{...p,[key]:value}:p));

 async function submit(e){
  e.preventDefault();setError('');
  if(!form.representativeName||!form.phone||!form.university||Number(form.studentCount)<1){setError('أكملي البيانات الأساسية للدفعة');return}
  setLoading(true);
  try{
   const fd=new FormData();
   fd.append('payload',JSON.stringify({...form,studentCount:Number(form.studentCount),estimatedBudget:form.estimatedBudget?Number(form.estimatedBudget):undefined,
    products:products.map(p=>({...p,quantity:Number(p.quantity)||1,sizes:p.sizes?p.sizes.split(',').map(x=>x.trim()).filter(Boolean):[],colors:p.colors?p.colors.split(',').map(x=>x.trim()).filter(Boolean):[]}))
   }));
   files.forEach(f=>fd.append('designFiles',f));
   const result=await groupOrderApi.create(fd);setDone(result);
  }catch(e){setError(e.message)}finally{setLoading(false)}
 }
 return <section className="group-page"><button className="back-btn" onClick={onSuccess}><ArrowRight/> حسابي</button>
 <div className="group-head"><span className="eyebrow">جهز دفعتك • GROUP GRADUATION</span><h1>حجز تجهيز دفعة</h1><p>اطلبي تجهيز الدفعة بالكامل، وسنراجع التفاصيل ثم نرسل لك عرض السعر.</p></div>
 <form onSubmit={submit} className="group-layout"><div>
  <div className="form-card"><h3>بيانات المسؤول عن الدفعة</h3><div className="form-grid"><label>اسم الممثل<input name="representativeName" value={form.representativeName} onChange={update}/></label><label>الهاتف<input name="phone" value={form.phone} onChange={update}/></label><label>واتساب<input name="whatsapp" value={form.whatsapp} onChange={update}/></label><label>الجامعة<input name="university" value={form.university} onChange={update}/></label><label>الكلية<input name="faculty" value={form.faculty} onChange={update}/></label><label>القسم<input name="department" value={form.department} onChange={update}/></label><label>عدد الطلاب<input type="number" min="1" name="studentCount" value={form.studentCount} onChange={update}/></label><label>تاريخ التخرج<input type="date" name="graduationDate" value={form.graduationDate} onChange={update}/></label><label>موعد التسليم المطلوب<input type="date" name="requiredDeliveryDate" value={form.requiredDeliveryDate} onChange={update}/></label><label>الميزانية التقديرية<input type="number" min="0" name="estimatedBudget" value={form.estimatedBudget} onChange={update}/></label></div></div>
  <div className="form-card"><div className="section-title-row"><h3>المنتجات المطلوبة</h3><button type="button" className="outline-btn" onClick={addProduct}><Plus size={15}/> إضافة منتج</button></div>{!products.length?<p className="muted">يمكنك إضافة المنتجات المطلوبة للدفعة.</p>:products.map((p,i)=><div className="group-product-row" key={i}><input placeholder="Product ID (سيتم ربطه بالكتالوج)" value={p.productId} onChange={e=>changeProduct(i,'productId',e.target.value)}/><input type="number" min="1" placeholder="الكمية" value={p.quantity} onChange={e=>changeProduct(i,'quantity',e.target.value)}/><input placeholder="المقاسات: M, L, XL" value={p.sizes} onChange={e=>changeProduct(i,'sizes',e.target.value)}/><input placeholder="الألوان" value={p.colors} onChange={e=>changeProduct(i,'colors',e.target.value)}/><button type="button" className="delete-row" onClick={()=>removeProduct(i)}><Trash2 size={16}/></button></div>)}</div>
  <div className="form-card"><h3>{isArabic?'التصميم والتخصيص':'Customization'}</h3><label>{isArabic?'تفاصيل الطباعة والتخصيص':'Customization details'}<textarea name="customizationDetails" value={form.customizationDetails} onChange={update}/></label><label>{isArabic?'ملاحظات إضافية':'Additional notes'}<textarea name="notes" value={form.notes} onChange={update}/></label><label className="upload-box"><Upload size={22}/><span>{isArabic?'رفع ملفات التصميم':'Upload design files'}</span><small>JPG, PNG, WEBP, PDF — حتى 10MB للملف</small><input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={e=>setFiles(Array.from(e.target.files||[]))}/></label>{files.length>0&&<div className="file-list">{files.map(f=><span key={f.name}>{f.name}</span>)}</div>}</div>
  {error&&<div className="form-error">{error}</div>}<button className="primary submit-group" disabled={loading}>{loading?'جاري إرسال الطلب...':'إرسال طلب تجهيز الدفعة'}</button>
 </div><aside className="group-side"><div className="group-info"><Users size={24}/><h3>{isArabic?'كيف تعمل الخدمة؟':'How it works'}</h3><ol><li>{isArabic?'ترسلين بيانات الدفعة.':'Send your group details.'}</li><li>{isArabic?'نراجع المنتجات والمقاسات والتصميم.':'We review products, sizes and artwork.'}</li><li>{isArabic?'نتواصل معك للتفاصيل.':'We contact you for the details.'}</li><li>{isArabic?'نجهز عرض السعر.':'We prepare a quote.'}</li><li>{isArabic?'بعد الموافقة يبدأ التنفيذ.':'Production starts after approval.'}</li></ol></div></aside></form>
 </section>
}
