import React,{useEffect,useState} from 'react';
import {ArrowRight,CheckCircle2,Clock3,PackageCheck,ShoppingBag,MapPin} from 'lucide-react';
import {orderApi} from '../services/api.js';
import {useLanguage,money} from '../context/LanguageContext.jsx';

const steps=['new','paid','processing','shipped','ready','delivered'];
const labels={ar:{new:'تم استلام الطلب',paid:'تم تأكيد الدفع',processing:'قيد التجهيز',shipped:'في الشحن',ready:'جاهز للتسليم',delivered:'تم التسليم'},en:{new:'Order received',paid:'Payment confirmed',processing:'Being prepared',shipped:'Shipped',ready:'Ready for delivery',delivered:'Delivered'}};
export default function OrderTrackingPage({onBack,onOrder}){
 const {isArabic}=useLanguage(); const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true); const [selected,setSelected]=useState(null);
 useEffect(()=>{orderApi.mine().then(data=>{setOrders(data);setSelected(data.find(x=>!['delivered','cancelled'].includes(x.status))||data[0]||null)}).catch(()=>{}).finally(()=>setLoading(false))},[]);
 const active=selected; const current=active?Math.max(0,steps.indexOf(active.status)):0;
 if(loading)return <section className="tracking-page"><div className="detail-loading">{isArabic?'جاري تحميل طلباتك...':'Loading your orders...'}</div></section>;
 return <section className="tracking-page">
  <button className="back-btn" onClick={onBack}><ArrowRight size={18}/>{isArabic?'حسابي':'My account'}</button>
  <div className="tracking-head"><div><span className="eyebrow">{isArabic?'TRACK YOUR ORDER':'TRACK YOUR ORDER'}</span><h1>{isArabic?'تابعي طلبك خطوة بخطوة':'Track your order, step by step'}</h1><p>{isArabic?'كل طلباتك السابقة والحالية في مكان واحد.':'Your current and previous purchases, all in one place.'}</p></div><div className="tracking-icon"><PackageCheck/></div></div>
  {!orders.length?<div className="empty-state"><ShoppingBag size={36}/><h3>{isArabic?'لسه مفيش مشتريات':'No purchases yet'}</h3><p>{isArabic?'أول ما تعملي طلب هيظهر هنا.':'Your purchases will appear here once you place an order.'}</p></div>:<div className="tracking-layout">
   <aside className="tracking-orders"><h3>{isArabic?'مشترياتي السابقة':'Purchase history'}</h3>{orders.map(o=><button key={o._id} className={selected?._id===o._id?'tracking-order active':'tracking-order'} onClick={()=>setSelected(o)}><div><b>{o.orderNumber}</b><small>{new Date(o.createdAt).toLocaleDateString(isArabic?'ar-EG':'en-US')}</small></div><strong>{money(o.total,isArabic)}</strong></button>)}</aside>
   {active&&<div className="tracking-card"><div className="tracking-card-head"><div><span className="eyebrow">{active.orderNumber}</span><h2>{isArabic?'حالة طلبك':'Order status'}</h2></div><button className="secondary" onClick={()=>onOrder(active._id)}>{isArabic?'تفاصيل الطلب':'View details'}</button></div>
    <div className="timeline">{steps.map((step,i)=>{const done=i<=current;return <div className={`timeline-step ${done?'done':''} ${i===current?'current':''}`} key={step}><div className="timeline-dot">{done?<CheckCircle2 size={17}/>:<Clock3 size={16}/>}</div><div><b>{labels[isArabic?'ar':'en'][step]}</b>{i===current&&<small>{isArabic?'الحالة الحالية':'Current status'}</small>}</div>{i<steps.length-1&&<span className="timeline-line"/>}</div>})}</div>
    {active.shippingLocation&&<a className="tracking-location" href={active.shippingLocation.startsWith('http')?active.shippingLocation:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.shippingLocation)}`} target="_blank" rel="noreferrer"><MapPin size={16}/>{isArabic?'افتح لوكيشن الشحن على Google Maps':'Open shipping location on Google Maps'}</a>}<div className="tracking-meta"><div><span>{isArabic?'طريقة الدفع':'Payment method'}</span><b>{active.payment?.method||'—'}</b></div><div><span>{isArabic?'حالة الدفع':'Payment status'}</span><b>{active.payment?.status||'—'}</b></div><div><span>{isArabic?'الإجمالي':'Total'}</span><b>{money(active.total,isArabic)}</b></div></div>
   </div>}
  </div>}
 </section>
}
