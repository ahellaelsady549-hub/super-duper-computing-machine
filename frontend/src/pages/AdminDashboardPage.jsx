import React,{useEffect,useState} from 'react';
import {LayoutDashboard,Package,FolderTree,ShoppingBag,Users,UsersRound,FileText,LogOut,Plus,Edit3,Trash2,RefreshCw,Bell,MapPin} from 'lucide-react';
import {adminApi} from '../services/adminApi.js';
import EngagementAdminPage from './EngagementAdminPage.jsx';
import {useAuth} from '../context/AuthContext.jsx';

const emptyProduct={nameAr:'',nameEn:'',descriptionAr:'',descriptionEn:'',mainImage:'',gallery:[],category:'',price:'',salePrice:'',discountPercentage:'',sizes:[],colors:[],customizationOptions:[],stock:0,sku:'',featured:false,active:true,productType:'apparel',shieldTextLabelAr:'النص المطلوب على الدرع',shieldTextLabelEn:'Text to engrave on the shield'};
const emptyCategory={nameAr:'',nameEn:'',slug:'',active:true};
const statuses=['new','paid','processing','shipped','ready','delivered','cancelled'];
const groupStatuses=['new','contacted','negotiating','quote_sent','approved','processing','ready','delivered','rejected','cancelled'];

export default function AdminDashboardPage({onLogout,onBack}){
 const {user}=useAuth();const [notifications,setNotifications]=useState([]);const [tab,setTab]=useState('dashboard');const [data,setData]=useState({stats:{},recentOrders:[],recentGroups:[]});const [products,setProducts]=useState([]),[categories,setCategories]=useState([]),[customers,setCustomers]=useState([]),[orders,setOrders]=useState([]),[groups,setGroups]=useState([]),[quotes,setQuotes]=useState([]);const [modal,setModal]=useState(null);const [error,setError]=useState('');const [loading,setLoading]=useState(false);

 async function load(name=tab){
  setLoading(true);setError('');
  try{
   if(name==='dashboard'){setData(await adminApi.dashboard());setNotifications(await adminApi.notifications())};
   if(name==='products')setProducts(await adminApi.products());
   if(name==='categories')setCategories(await adminApi.categories());
   if(name==='customers')setCustomers(await adminApi.customers());
   if(name==='orders')setOrders(await adminApi.orders());
   if(name==='groups')setGroups(await adminApi.groupOrders());
   if(name==='quotes')setQuotes(await adminApi.quotes());
   if(name==='notifications')setNotifications(await adminApi.notifications());
   if(name==='engagement'){}
  }catch(e){setError(e.message)}finally{setLoading(false)}
 }
 useEffect(()=>{load(tab)},[tab]);

 const nav=[
  ['dashboard','لوحة التحكم',LayoutDashboard],['products','المنتجات',Package],['categories','التصنيفات',FolderTree],['orders','الطلبات',ShoppingBag],['groups','تجهيز الدفعات',UsersRound],['quotes','عروض الأسعار',FileText],['customers','العملاء',Users],['engagement','المحتوى والتقييمات',FileText],['notifications','الإشعارات',Bell]
 ];
 const title=nav.find(x=>x[0]===tab)?.[1]||'لوحة التحكم';

 async function remove(type,id){
  if(!confirm('هل تريد حذف هذا العنصر؟'))return;
  try{if(type==='product')await adminApi.deleteProduct(id);if(type==='category')await adminApi.deleteCategory(id);load(tab)}catch(e){setError(e.message)}
 }
 return <section className="admin-shell">
  <aside className="admin-sidebar"><div className="admin-brand"><span>REFLECT</span><small>ADMIN PANEL</small></div>{nav.map(([id,label,Icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={18}/>{label}</button>)}<div className="admin-sidebar-bottom"><button onClick={onBack}>الموقع</button><button onClick={onLogout}><LogOut size={17}/> خروج</button></div></aside>
  <main className="admin-main"><header className="admin-top"><div><span className="eyebrow">ADMINISTRATION</span><h1>{title}</h1></div><div className="admin-user"><button className="admin-notify" onClick={()=>setTab('notifications')}><Bell size={17}/>{notifications.filter(n=>!n.read).length>0&&<span>{notifications.filter(n=>!n.read).length}</span>}</button>{user?.email}<button onClick={()=>load(tab)}><RefreshCw size={17}/></button></div></header>
  {error&&<div className="form-error admin-error">{error}</div>}
  {loading&&<div className="admin-loading">جاري تحميل البيانات...</div>}
  {!loading&&tab==='dashboard'&&<Dashboard data={data} onTab={setTab}/>}
  {!loading&&tab==='products'&&<Products products={products} categories={categories} onAdd={()=>setModal({type:'product',item:emptyProduct})} onEdit={p=>setModal({type:'product',item:p})} onDelete={id=>remove('product',id)}/>}
  {!loading&&tab==='categories'&&<Categories categories={categories} onAdd={()=>setModal({type:'category',item:emptyCategory})} onEdit={c=>setModal({type:'category',item:c})} onDelete={id=>remove('category',id)}/>}
  {!loading&&tab==='customers'&&<Customers customers={customers}/>}
  {!loading&&tab==='engagement'&&<EngagementAdminPage/>}
  {!loading&&tab==='notifications'&&<AdminNotifications notifications={notifications} onRead={async id=>{await adminApi.readNotification(id);setNotifications(await adminApi.notifications())}}/>}
  {!loading&&tab==='orders'&&<Orders orders={orders} onSave={async(id,b)=>{await adminApi.updateOrder(id,b);load('orders')}}/>}
  {!loading&&tab==='groups'&&<Groups groups={groups} onSave={async(id,b)=>{await adminApi.updateGroupOrder(id,b);load('groups')}}/>}
  {!loading&&tab==='quotes'&&<Quotes quotes={quotes} groups={groups} onAdd={()=>setModal({type:'quote',item:{groupOrderId:'',proposedPrice:'',details:'',expiresAt:'',items:[]}})} onEdit={q=>setModal({type:'quote',item:q})} onSave={async(id,b)=>{await adminApi.updateQuote(id,b);load('quotes')}}/>}
  </main>
  {modal&&<AdminModal modal={modal} categories={categories} groups={groups} onClose={()=>setModal(null)} onSaved={()=>{setModal(null);load(tab)}}/>}
 </section>
}

function Dashboard({data,onTab}){
 const s=data.stats||{};return <div><div className="stat-grid">{[['customers','العملاء'],['products','المنتجات'],['orders','الطلبات'],['groups','طلبات الدفعات'],['quotes','عروض الأسعار'],['revenue','المبيعات']].map(([k,l])=><div className="stat-card" key={k}><span>{l}</span><strong>{k==='revenue'?`${Number(s[k]||0).toLocaleString('ar-EG')} ج.م`:s[k]||0}</strong></div>)}</div><div className="admin-panels"><div className="admin-panel"><div className="panel-head"><h3>آخر الطلبات</h3><button onClick={()=>onTab('orders')}>عرض الكل</button></div>{data.recentOrders?.map(o=><div className="compact-row" key={o._id}><b>{o.orderNumber}</b><span>{o.customer?.fullName||'—'}</span><strong>{o.total.toLocaleString('ar-EG')} ج.م</strong></div>)}</div><div className="admin-panel"><div className="panel-head"><h3>آخر طلبات الدفعات</h3><button onClick={()=>onTab('groups')}>عرض الكل</button></div>{data.recentGroups?.map(g=><div className="compact-row" key={g._id}><b>{g.requestNumber}</b><span>{g.university}</span><strong>{g.studentCount} طالب</strong></div>)}</div></div></div>
}

function Products({products,categories,onAdd,onEdit,onDelete}){
 return <div className="admin-panel"><div className="panel-head"><h3>إدارة المنتجات</h3><button className="admin-add" onClick={onAdd}><Plus size={16}/> منتج جديد</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>المنتج</th><th>SKU</th><th>التصنيف</th><th>السعر</th><th>المخزون</th><th>الحالة</th><th></th></tr></thead><tbody>{products.map(p=><tr key={p._id}><td><b>{p.nameAr}</b><small>{p.nameEn}</small></td><td>{p.sku||'—'}</td><td>{p.category?.nameAr||'—'}</td><td>{p.salePrice??p.price} ج.م</td><td>{p.stock}</td><td><span className={p.active?'badge good':'badge'}>{p.active?'نشط':'مخفي'}</span></td><td><button className="icon-btn" onClick={()=>onEdit(p)}><Edit3 size={15}/></button><button className="icon-btn danger" onClick={()=>onDelete(p._id)}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div></div>
}
function Categories({categories,onAdd,onEdit,onDelete}){
 return <div className="admin-panel"><div className="panel-head"><h3>إدارة التصنيفات</h3><button className="admin-add" onClick={onAdd}><Plus size={16}/> تصنيف جديد</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>العربي</th><th>English</th><th>Slug</th><th>الحالة</th><th></th></tr></thead><tbody>{categories.map(c=><tr key={c._id}><td>{c.nameAr}</td><td>{c.nameEn}</td><td>{c.slug}</td><td>{c.active?'نشط':'مخفي'}</td><td><button className="icon-btn" onClick={()=>onEdit(c)}><Edit3 size={15}/></button><button className="icon-btn danger" onClick={()=>onDelete(c._id)}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div></div>
}
function Customers({customers}){return <div className="admin-panel"><div className="panel-head"><h3>العملاء</h3><span>{customers.length} عميل</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>الاسم</th><th>Email</th><th>الهاتف</th><th>الجامعة</th><th>التسجيل</th></tr></thead><tbody>{customers.map(c=><tr key={c._id}><td><b>{c.fullName}</b></td><td>{c.email}</td><td>{c.phone||'—'}</td><td>{c.university||'—'}</td><td>{new Date(c.createdAt).toLocaleDateString('ar-EG')}</td></tr>)}</tbody></table></div></div>}
function Orders({orders,onSave}){return <div className="admin-panel"><div className="panel-head"><h3>الطلبات</h3><span>{orders.length} طلب</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الإجمالي</th><th>الدفع</th><th>الحالة</th><th>لوكيشن الشحن</th></tr></thead><tbody>{orders.map(o=><tr key={o._id}><td><b>{o.orderNumber}</b></td><td>{o.customer?.fullName||'—'}</td><td>{o.total.toLocaleString('ar-EG')} ج.م</td><td><select value={o.payment?.status||'pending'} onChange={e=>onSave(o._id,{status:o.status,paymentStatus:e.target.value,shippingLocation:o.shippingLocation||''})}><option value="pending">pending</option><option value="successful">successful</option><option value="failed">failed</option></select></td><td><select value={o.status} onChange={e=>onSave(o._id,{status:e.target.value,paymentStatus:o.payment?.status,shippingLocation:o.shippingLocation||''})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td><td><div className="admin-location"><MapPin size={14}/><input defaultValue={o.shippingLocation||''} placeholder="Google Maps / location" onBlur={e=>{if(e.target.value!==o.shippingLocation)onSave(o._id,{status:o.status,paymentStatus:o.payment?.status,shippingLocation:e.target.value})}}/></div></td></tr>)}</tbody></table></div></div>}
function Groups({groups,onSave}){return <div className="admin-panel"><div className="panel-head"><h3>طلبات تجهيز الدفعات</h3><span>{groups.length} طلب</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>رقم الطلب</th><th>الجامعة</th><th>الطلاب</th><th>العميل</th><th>الحالة</th></tr></thead><tbody>{groups.map(g=><tr key={g._id}><td><b>{g.requestNumber}</b></td><td>{g.university}</td><td>{g.studentCount}</td><td>{g.customer?.fullName||'—'}</td><td><select value={g.status} onChange={e=>onSave(g._id,{status:e.target.value})}>{groupStatuses.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></div>}
function Quotes({quotes,onAdd,onEdit,onSave}){return <div className="admin-panel"><div className="panel-head"><h3>عروض الأسعار</h3><button className="admin-add" onClick={onAdd}><Plus size={16}/> إنشاء عرض</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>الرقم</th><th>العميل</th><th>المبلغ</th><th>الحالة</th><th>الصلاحية</th><th></th></tr></thead><tbody>{quotes.map(q=><tr key={q._id}><td><b>{q.quoteNumber}</b></td><td>{q.customer?.fullName||'—'}</td><td>{q.proposedPrice.toLocaleString('ar-EG')} ج.م</td><td><select value={q.status} onChange={e=>onSave(q._id,{status:e.target.value})}>{['new','contacted','quote_sent','approved','rejected','expired'].map(s=><option key={s}>{s}</option>)}</select></td><td>{q.expiresAt?new Date(q.expiresAt).toLocaleDateString('ar-EG'):'—'}</td><td><button className="icon-btn" onClick={()=>onEdit(q)}><Edit3 size={15}/></button></td></tr>)}</tbody></table></div></div>}

function AdminNotifications({notifications,onRead}){return <div className="admin-panel"><div className="panel-head"><h3>إشعارات الطلبات</h3><span>{notifications.filter(n=>!n.read).length} جديد</span></div>{!notifications.length?<div className="empty-state"><Bell size={30}/><p>مفيش إشعارات جديدة.</p></div>:<div className="notification-list">{notifications.map(n=><button key={n._id} className={n.read?'notification-row':'notification-row unread'} onClick={()=>!n.read&&onRead(n._id)}><span><Bell size={17}/></span><div><b>{n.title}</b><p>{n.message}</p><small>{new Date(n.createdAt).toLocaleString('ar-EG')}</small></div>{n.order&&<strong>{n.order.orderNumber}</strong>}</button>)}</div>}</div>}

function AdminModal({modal,categories,groups,onClose,onSaved}){
 const [item,setItem]=useState({...modal.item});const [error,setError]=useState('');const [saving,setSaving]=useState(false);
 const change=(key,value)=>setItem({...item,[key]:value});
 async function save(e){
  e.preventDefault();setSaving(true);setError('');
  try{
   if(modal.type==='product'){
    const body={...item,price:Number(item.price)||0,salePrice:item.salePrice===''?undefined:Number(item.salePrice),discountPercentage:item.discountPercentage===''?undefined:Number(item.discountPercentage),stock:Number(item.stock)||0,sizes:Array.isArray(item.sizes)?item.sizes:String(item.sizes||'').split(',').map(x=>x.trim()).filter(Boolean),colors:Array.isArray(item.colors)?item.colors:String(item.colors||'').split('\n').map(line=>{const [nameAr,nameEn,code,image]=line.split('|').map(x=>x.trim());return nameAr?{nameAr,nameEn:nameEn||nameAr,code:code||'',image:image||''}:null}).filter(Boolean),gallery:Array.isArray(item.gallery)?item.gallery:String(item.gallery||'').split('\n').map(x=>x.trim()).filter(Boolean)};
    item._id?await adminApi.updateProduct(item._id,body):await adminApi.createProduct(body);
   }else if(modal.type==='category'){
    item._id?await adminApi.updateCategory(item._id,item):await adminApi.createCategory(item);
   }else{
    const body={groupOrderId:item.groupOrderId,proposedPrice:Number(item.proposedPrice),details:item.details,expiresAt:item.expiresAt,items:item.items||[]};
    await adminApi.createQuote(body);
   }
   onSaved();
  }catch(e){setError(e.message)}finally{setSaving(false)}
 }
 return <div className="admin-modal-layer"><div className="admin-modal"><div className="modal-head"><h3>{modal.type==='product'?(item._id?'تعديل منتج':'منتج جديد'):modal.type==='category'?(item._id?'تعديل تصنيف':'تصنيف جديد'):'إنشاء عرض سعر'}</h3><button onClick={onClose}>×</button></div><form onSubmit={save}>
 {modal.type==='product'&&<><div className="form-grid"><label>الاسم بالعربي<input value={item.nameAr||''} onChange={e=>change('nameAr',e.target.value)} required/></label><label>English Name<input value={item.nameEn||''} onChange={e=>change('nameEn',e.target.value)} required/></label><label>SKU<input value={item.sku||''} onChange={e=>change('sku',e.target.value)}/></label><label>التصنيف<select value={item.category?._id||item.category||''} onChange={e=>change('category',e.target.value)}><option value="">بدون تصنيف</option>{categories.map(c=><option key={c._id} value={c._id}>{c.nameAr}</option>)}</select></label><label>السعر<input type="number" value={item.price??''} onChange={e=>change('price',e.target.value)} required/></label><label>سعر الخصم<input type="number" value={item.salePrice??''} onChange={e=>change('salePrice',e.target.value)}/></label><label>المخزون<input type="number" value={item.stock??0} onChange={e=>change('stock',e.target.value)}/></label><label>الصورة الرئيسية<input value={item.mainImage||''} onChange={e=>change('mainImage',e.target.value)}/></label><label>نوع المنتج<select value={item.productType||'apparel'} onChange={e=>change('productType',e.target.value)}><option value="apparel">ملابس</option><option value="shield">درع</option><option value="accessory">إكسسوار</option><option value="other">أخرى</option></select></label><label>نسبة الخصم %<input type="number" min="0" max="100" value={item.discountPercentage??''} onChange={e=>change('discountPercentage',e.target.value)}/></label><label className="wide">المقاسات <input value={Array.isArray(item.sizes)?item.sizes.join(', '):item.sizes||''} onChange={e=>change('sizes',e.target.value)} placeholder="S, M, L, XL"/></label><label className="wide">الألوان <textarea value={Array.isArray(item.colors)?item.colors.map(c=>[c.nameAr,c.nameEn,c.code,c.image].filter(Boolean).join(' | ')).join('\n'):item.colors||''} onChange={e=>change('colors',e.target.value)} placeholder="كحلي | Navy | #0b1f42 | /image.jpg"/></label><label className="wide">وصف عربي<textarea value={item.descriptionAr||''} onChange={e=>change('descriptionAr',e.target.value)}/></label><label className="wide">Description (English)<textarea value={item.descriptionEn||''} onChange={e=>change('descriptionEn',e.target.value)}/></label><label className="wide">نص الدرع بالعربي<input value={item.shieldTextLabelAr||''} onChange={e=>change('shieldTextLabelAr',e.target.value)}/></label><label className="wide">Shield text label<input value={item.shieldTextLabelEn||''} onChange={e=>change('shieldTextLabelEn',e.target.value)}/></label><label className="wide">Gallery URLs<textarea value={Array.isArray(item.gallery)?item.gallery.join('\n'):item.gallery||''} onChange={e=>change('gallery',e.target.value)}/></label></div><label className="modal-check"><input type="checkbox" checked={!!item.featured} onChange={e=>change('featured',e.target.checked)}/> Featured</label><label className="modal-check"><input type="checkbox" checked={item.active!==false} onChange={e=>change('active',e.target.checked)}/> نشط</label></>}
 {modal.type==='category'&&<div className="form-grid"><label>العربي<input value={item.nameAr||''} onChange={e=>change('nameAr',e.target.value)} required/></label><label>English<input value={item.nameEn||''} onChange={e=>change('nameEn',e.target.value)} required/></label><label>Slug<input value={item.slug||''} onChange={e=>change('slug',e.target.value)} required/></label></div>}
 {modal.type==='quote'&&<div className="form-grid"><label className="wide">طلب الدفعة<select value={item.groupOrderId||item.groupOrder?._id||''} onChange={e=>change('groupOrderId',e.target.value)} required><option value="">اختاري الطلب</option>{groups.map(g=><option key={g._id} value={g._id}>{g.requestNumber} — {g.university}</option>)}</select></label><label>المبلغ<input type="number" value={item.proposedPrice||''} onChange={e=>change('proposedPrice',e.target.value)} required/></label><label>تاريخ الانتهاء<input type="date" value={item.expiresAt?String(item.expiresAt).slice(0,10):''} onChange={e=>change('expiresAt',e.target.value)}/></label><label className="wide">تفاصيل العرض<textarea value={item.details||''} onChange={e=>change('details',e.target.value)}/></label></div>}
 {error&&<div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" onClick={onClose}>إلغاء</button><button className="primary" disabled={saving}>{saving?'حفظ...':'حفظ'}</button></div></form></div></div>
}
