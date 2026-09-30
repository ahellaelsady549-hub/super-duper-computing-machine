import React,{useEffect,useState} from 'react';
import {ArrowRight,FileText} from 'lucide-react';
import {groupOrderApi} from '../services/api.js';
const labels={new:'جديد',contacted:'تم التواصل',negotiating:'جاري الاتفاق',quote_sent:'تم إرسال العرض',approved:'تمت الموافقة',processing:'قيد التنفيذ',ready:'جاهز',delivered:'تم التسليم',rejected:'مرفوض',cancelled:'ملغي'};
export default function GroupOrderDetailsPage({id,onBack}){
 const [data,setData]=useState(null);useEffect(()=>{groupOrderApi.get(id).then(setData).catch(console.error)},[id]);
 if(!data)return <section className="detail-page"><div className="detail-loading">جاري تحميل الطلب...</div></section>;
 return <section className="group-detail-page"><button className="back-btn" onClick={onBack}><ArrowRight/> حسابي</button><span className="eyebrow">GROUP REQUEST</span><h1>{data.requestNumber}</h1><div className="group-status">{labels[data.status]||data.status}</div><div className="group-detail-grid"><div className="form-card"><h3>بيانات الدفعة</h3><div className="info-grid"><p><b>الممثل:</b> {data.representativeName}</p><p><b>الجامعة:</b> {data.university}</p><p><b>الكلية:</b> {data.faculty||'—'}</p><p><b>القسم:</b> {data.department||'—'}</p><p><b>عدد الطلاب:</b> {data.studentCount}</p><p><b>التخرج:</b> {data.graduationDate||'—'}</p><p><b>التسليم:</b> {data.requiredDeliveryDate||'—'}</p></div></div><div className="form-card"><h3><FileText size={18}/> الملفات</h3>{data.designFiles?.length?data.designFiles.map(f=><div className="file-row" key={f.storedName}>{f.originalName}<small>{Math.round(f.size/1024)} KB</small></div>):<p className="muted">لا توجد ملفات.</p>}</div></div><div className="form-card"><h3>التخصيص والملاحظات</h3><p>{data.customizationDetails||'—'}</p><p>{data.notes||'—'}</p></div></section>
}
