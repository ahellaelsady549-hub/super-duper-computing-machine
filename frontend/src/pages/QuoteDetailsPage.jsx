import React,{useEffect,useState} from 'react';
import {ArrowRight,CheckCircle2,XCircle} from 'lucide-react';
import {quoteApi} from '../services/api.js';
import {useLanguage,money} from '../context/LanguageContext.jsx';
export default function QuoteDetailsPage({id,onBack}){
 const {isArabic}=useLanguage(); const [quote,setQuote]=useState(null);const [message,setMessage]=useState('');const [error,setError]=useState('');
 useEffect(()=>{quoteApi.get(id).then(setQuote).catch(e=>setError(e.message))},[id]);
 if(!quote)return <section className="detail-page"><div className="detail-loading">{error||(isArabic?'جاري تحميل العرض...':'Loading quote...')}</div></section>;
 async function respond(action){try{setError('');setQuote(await quoteApi.respond(id,{action,message}))}catch(e){setError(e.message)}}
 return <section className="quote-detail-page"><button className="back-btn" onClick={onBack}><ArrowRight/> {isArabic?'حسابي':'My account'}</button><span className="eyebrow">QUOTATION</span><h1>{quote.quoteNumber}</h1><div className="quote-price">{money(quote.proposedPrice,isArabic)}</div><div className="form-card"><h3>{isArabic?'تفاصيل العرض':'Quote details'}</h3><p>{quote.details||(isArabic?'لا توجد تفاصيل إضافية.':'No additional details.')}</p>{quote.expiresAt&&<p className="muted">{isArabic?'صالح حتى: ':'Valid until: '} {new Date(quote.expiresAt).toLocaleDateString(isArabic?'ar-EG':'en-US')}</p>}{quote.items?.map(i=><div className="summary-item" key={i._id}><span>{i.description} × {i.quantity}</span><b>{money(i.total,isArabic)}</b></div>)}</div>{quote.status==='quote_sent'&&<div className="quote-response"><textarea placeholder={isArabic?"رسالة اختيارية":"Optional message"} value={message} onChange={e=>setMessage(e.target.value)}/><div><button className="approve" onClick={()=>respond('approved')}><CheckCircle2 size={17}/>{isArabic?'موافقة على العرض':'Approve quote'}</button><button className="reject" onClick={()=>respond('rejected')}><XCircle size={17}/>{isArabic?'رفض العرض':'Reject quote'}</button></div></div>}{error&&<div className="form-error">{error}</div>}</section>
}
