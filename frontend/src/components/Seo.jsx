import {useEffect} from 'react';

const SITE='REFLECT | Graduation & Apparel';
export default function Seo({title=SITE,description='منتجات وتجهيزات التخرج والملابس المخصصة والدفعات الجماعية من REFLECT.',canonical}){
 useEffect(()=>{
  document.title=title;
  const setMeta=(name,content)=>{let el=document.querySelector(`meta[name="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute('name',name);document.head.appendChild(el)}el.setAttribute('content',content)};
  setMeta('description',description);setMeta('robots','index,follow');
  let link=document.querySelector('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}link.href=canonical||window.location.href.split('#')[0];
  let og=document.querySelector('meta[property="og:title"]');if(!og){og=document.createElement('meta');og.setAttribute('property','og:title');document.head.appendChild(og)}og.content=title;
  let od=document.querySelector('meta[property="og:description"]');if(!od){od=document.createElement('meta');od.setAttribute('property','og:description');document.head.appendChild(od)}od.content=description;
 },[title,description,canonical]);
 return null;
}
