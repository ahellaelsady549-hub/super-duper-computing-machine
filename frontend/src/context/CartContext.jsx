import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';

const CartContext=createContext(null);
const KEY='reflect_cart';

export function CartProvider({children}){
  const [items,setItems]=useState(()=>{
    try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return []}
  });

  useEffect(()=>localStorage.setItem(KEY,JSON.stringify(items)),[items]);

  const addItem=(item)=>{
    setItems(current=>{
      const key=`${item.productId}-${item.colorId||''}-${item.size||''}-${JSON.stringify(item.customization||{})}`;
      const index=current.findIndex(x=>x.key===key);
      if(index>=0){
        const copy=[...current];
        copy[index]={...copy[index],quantity:copy[index].quantity+item.quantity};
        return copy;
      }
      return [...current,{...item,key}];
    });
  };

  const updateQuantity=(key,quantity)=>{
    setItems(current=>quantity<1?current.filter(x=>x.key!==key):current.map(x=>x.key===key?{...x,quantity}:x));
  };
  const removeItem=(key)=>setItems(current=>current.filter(x=>x.key!==key));
  const clearCart=()=>setItems([]);
  const count=items.reduce((n,x)=>n+x.quantity,0);
  const subtotal=items.reduce((n,x)=>n+(Number(x.price)||0)*x.quantity,0);

  const value=useMemo(()=>({items,addItem,updateQuantity,removeItem,clearCart,count,subtotal}),[items,count,subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart=()=>useContext(CartContext);
