import React from 'react';
import {X,Plus,Minus,Trash2,ShoppingBag,ArrowLeft} from 'lucide-react';
import {useCart} from '../context/CartContext.jsx';

export default function CartDrawer({open,onClose}){
 const goCheckout=()=>{onClose();window.dispatchEvent(new Event('reflect-checkout'))}
 const {items,subtotal,updateQuantity,removeItem}=useCart();
 return <div className={`drawer-layer ${open?'open':''}`} onClick={onClose}>
  <aside className="cart-drawer" onClick={e=>e.stopPropagation()}>
   <div className="drawer-head"><div><span className="eyebrow">REFLECT CART</span><h2>السلة</h2></div><button onClick={onClose}><X/></button></div>
   {!items.length?<div className="cart-empty"><ShoppingBag size={42}/><h3>السلة فارغة</h3><p>أضيفي المنتجات التي تريدينها هنا.</p></div>:
   <><div className="cart-items">{items.map(i=><div className="cart-item" key={i.key}><img src={i.image||'/reflect-logo.png'} alt=""/><div className="cart-item-copy"><h4>{i.productName}</h4><small>{i.colorName&&`اللون: ${i.colorName}`} {i.size&&` • المقاس: ${i.size}`}</small><b>{Number(i.price).toLocaleString('ar-EG')} ج.م</b><div className="cart-controls"><button onClick={()=>updateQuantity(i.key,i.quantity-1)}><Minus size={13}/></button><span>{i.quantity}</span><button onClick={()=>updateQuantity(i.key,i.quantity+1)}><Plus size={13}/></button><button className="remove" onClick={()=>removeItem(i.key)}><Trash2 size={15}/></button></div></div></div>)}</div>
   <div className="drawer-total"><span>الإجمالي</span><strong>{Number(subtotal).toLocaleString('ar-EG')} ج.م</strong></div><button className="checkout-btn" onClick={goCheckout}>إتمام الشراء <ArrowLeft size={18}/></button></>}
  </aside>
 </div>
}
