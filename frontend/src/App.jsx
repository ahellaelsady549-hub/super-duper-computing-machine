import React,{useEffect,useState} from 'react';
import {ShoppingBag,Users,MessageCircle,ArrowLeft,Menu,X,UserCircle,Bell,Sun,Moon,Globe2} from 'lucide-react';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
import GroupOrderPage from './pages/GroupOrderPage.jsx';
import GroupOrderDetailsPage from './pages/GroupOrderDetailsPage.jsx';
import QuoteDetailsPage from './pages/QuoteDetailsPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import {FAQSection,GallerySection} from './components/EngagementSections.jsx';
import {CartProvider,useCart} from './context/CartContext.jsx';
import {AuthProvider,useAuth} from './context/AuthContext.jsx';
import Seo from './components/Seo.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import {LanguageProvider} from './context/LanguageContext.jsx';
import ExperienceReviewSection from './components/ExperienceReviewSection.jsx';

function Footer({onProducts,onGroup,onAuth,isArabic}){return <footer className="site-footer"><div className="footer-brand"><img src="/reflect-logo.png" alt="REFLECT"/><p>{isArabic?<>كل حاجة ليوم التخرج في مكان واحد.<br/>إنتِ عيشي اللحظة، وإحنا نهتم بالباقي.</>:<>Everything for graduation day in one place.<br/>You enjoy the moment, we handle the details.</>}</p></div><div><h4>{isArabic?"روحي فين؟":"Quick links"}</h4><button onClick={onProducts}>{isArabic?"المنتجات":"Products"}</button><button onClick={onGroup}>{isArabic?"جهزوا الدفعة":"Group booking"}</button><button onClick={onAuth}>{isArabic?"حسابي":"My account"}</button></div><div><h4>{isArabic?"محتاجين نتكلم؟":"Need help?"}</h4><a href="#faq">{isArabic?"الأسئلة الشائعة":"FAQ"}</a><a href="#services">{isArabic?"خدماتنا":"Services"}</a><a href="#about">{isArabic?"عن REFLECT":"About REFLECT"}</a></div><div><h4>{isArabic?"تابعينا":"Follow us"}</h4><p className="footer-social">Instagram · TikTok · WhatsApp</p><span className="footer-badge">{isArabic?"لحظتك.. وإحنا نهتم بالتفاصيل.":"Your moment, handled with care."}</span></div><div className="footer-bottom"><span>© 2026 REFLECT. {isArabic?"كل الحقوق محفوظة.":"All rights reserved."}</span><span>Privacy · Terms</span></div></footer>}

function AppInner(){
 const {count}=useCart();
 const {isAuthenticated,logout}=useAuth();
 const [page,setPage]=useState(window.location.hash==='#admin'?'admin-login':(isAuthenticated?'home':'auth'));
 const [productId,setProductId]=useState(null),[orderId,setOrderId]=useState(null),[groupId,setGroupId]=useState(null),[quoteId,setQuoteId]=useState(null),[cartOpen,setCartOpen]=useState(false),[mobile,setMobile]=useState(false);
 const [language,setLanguage]=useState(()=>localStorage.getItem('reflect-language')||'ar');
 const [darkMode,setDarkMode]=useState(()=>localStorage.getItem('reflect-theme')==='dark');
 const [uiFx,setUiFx]=useState(''); const [cartToast,setCartToast]=useState('');
 const isArabic=language==='ar';
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=isArabic?'rtl':'ltr';document.documentElement.dataset.theme=darkMode?'dark':'light';localStorage.setItem('reflect-language',language);localStorage.setItem('reflect-theme',darkMode?'dark':'light')},[language,darkMode,isArabic]);
 useEffect(()=>{
   const fn=()=>{if(isAuthenticated)setPage('checkout');else setPage('auth')};
   const login=()=>setPage('auth');
   const added=e=>{setCartToast(e.detail?.name||'Added to cart');window.setTimeout(()=>setCartToast(''),2200)};
   window.addEventListener('reflect-checkout',fn);window.addEventListener('reflect-login',login);window.addEventListener('reflect-cart-added',added);
   return()=>{window.removeEventListener('reflect-checkout',fn);window.removeEventListener('reflect-login',login);window.removeEventListener('reflect-cart-added',added)}
 },[isAuthenticated]);
 useEffect(()=>{
   if(!isAuthenticated && !['auth','admin-login'].includes(page)) setPage('auth');
   if(isAuthenticated && page==='auth') setPage('home');
 },[isAuthenticated,page]);
 const navigate=p=>{setUiFx('page-transition');setPage(p);setMobile(false);window.scrollTo(0,0);window.setTimeout(()=>setUiFx(''),650)};
 const openProduct=id=>{if(!isAuthenticated){navigate('auth');return}setProductId(id);navigate('product')};
 const goProducts=()=>{if(!isAuthenticated){navigate('auth');return}navigate('products')};
 const goAccount=()=>navigate(isAuthenticated?'account':'auth');
 const goGroup=()=>navigate(isAuthenticated?'group':'auth');
 const afterLogin=()=>navigate('home');
 const runFx=(name,action)=>{setUiFx(name);action();window.setTimeout(()=>setUiFx(''),520)};
 const toggleLanguage=()=>runFx('language-switch',()=>setLanguage(v=>v==='ar'?'en':'ar'));
 const toggleTheme=()=>runFx('theme-switch',()=>setDarkMode(v=>!v));
 const toggleMobile=()=>runFx('menu-switch',()=>setMobile(v=>!v));
 return <LanguageProvider language={language}><main className={`${uiFx} page-${page}`}>
 <Seo title={page==='home'?'REFLECT | ملابس وتجهيزات التخرج':page==='products'?'منتجات التخرج | REFLECT':page==='group'?'جهز دفعتك | REFLECT':'REFLECT | Graduation & Apparel'} />
 {page!=='auth'&&<header className="nav">
  <button className={`mobile-menu ${mobile?'is-open':''}`} aria-label={isArabic?'القائمة':'Menu'} onClick={toggleMobile}>{mobile?<X/>:<Menu/>}</button>
  <button className="nav-logo" aria-label="REFLECT" onClick={()=>isAuthenticated&&setPage('home')}><img src="/reflect-logo.png" alt="REFLECT" onDoubleClick={()=>setPage("admin-login")}/></button>
  <nav className={mobile?'mobile-open':''}>
   <a onClick={()=>{if(isAuthenticated)navigate('home')}}>{isArabic?'الرئيسية':'Home'}</a>
   <a onClick={goProducts}>{isArabic?'المنتجات':'Products'}</a>
   <a href="#services" onClick={()=>setMobile(false)}>{isArabic?'خدماتنا':'Services'}</a>
   <a onClick={goGroup}>{isArabic?'جهز دفعتك':'Group booking'}</a>
   <a href="#faq" onClick={()=>{if(isAuthenticated)navigate('home')}}>{isArabic?'الأسئلة':'FAQ'}</a>
   <a href="#about" onClick={()=>setMobile(false)}>{isArabic?'عن REFLECT':'About'}</a>
  </nav>
  <div className="actions">
   <button className="icon-action" title={isArabic?'الإشعارات':'Notifications'} onClick={goAccount}><Bell size={18}/></button>
   <button className={`language-btn ${uiFx==='language-switch'?'is-switching':''}`} onClick={toggleLanguage} title="Language"><Globe2 size={16}/><span>{isArabic?'EN':'عربي'}</span></button>
   <button className={`theme-btn ${uiFx==='theme-switch'?'is-switching':''}`} onClick={toggleTheme} title={isArabic?'تغيير المود':'Toggle theme'}>{darkMode?<Sun size={18}/>:<Moon size={18}/>}</button>
   <button className="cart-nav" onClick={()=>setCartOpen(true)} aria-label="Cart"><ShoppingBag size={19}/>{count>0&&<span>{count}</span>}</button>
   <button className="account-nav" onClick={goAccount}><UserCircle size={20}/></button>
   <button className="login" onClick={goAccount}>{isAuthenticated?(isArabic?'حسابي':'My account'):(isArabic?'تسجيل الدخول':'Sign in')}</button>
  </div>
 </header>}

 {page==='home'&&<><section className="hero"><div className="pattern"></div><div className="copy"><span className="eyebrow">REFLECT • GRADUATION & APPAREL</span><h1>{isArabic?<>يوم التخرج بيتعاش<br/><em>مرة واحدة..</em> خليه يستاهل</>:<>Graduation day happens<br/><em>once..</em> make it count</>}</h1><p>{isArabic?"كل مستلزمات يوم التخرج في مكان واحد.. من أول التصميم لحد آخر تفصيلة.":"Everything you need for graduation day, from the first design to the final detail."}</p><div className="ctas"><button className="primary" onClick={goProducts}>{isArabic?"تصفح المنتجات":"Shop products"} <ArrowLeft size={18}/></button><button className="secondary" onClick={goGroup}><Users size={18}/> {isArabic?"جهز دفعتك":"Plan your group"}</button></div><div className="trust"><span>{isArabic?"تصميم مخصص":"Custom design"}</span><i></i><span>{isArabic?"تجهيز دفعات":"Group orders"}</span><i></i><span>{isArabic?"منتجات تخرج":"Graduation wear"}</span></div></div><div className="visual"><div className="gold-ring"></div><img src="/reflect-logo.png" alt="REFLECT" onDoubleClick={()=>setPage("admin-login")}/><div className="tag">YOUR MOMENT.<br/><b>REFLECT IT.</b></div></div></section><section className="strip"><span>GRADUATION GOWNS</span><span className="strip-dot"><span></span></span><span>CUSTOM APPAREL</span><span className="strip-dot"><span></span></span><span>GROUP PACKAGES</span><span className="strip-dot"><span></span></span><span>AWARDS</span></section><FAQSection language={language}/><GallerySection language={language}/><ExperienceReviewSection language={language}/><section className="intro"><span className="eyebrow">{isArabic?"اختار اللي يناسب لحظتك":"PICK YOUR STYLE"}</span><h2>{isArabic?<>أكثر من مجرد <em>منتجات تخرج</em></>:<>More than just <em>graduation wear</em></>}</h2><p>{isArabic?"منتجات جاهزة للشراء، ومعها تجربة مخصصة لتجهيز دفعات التخرج.":"Ready-to-shop pieces plus a full group setup for your graduation day."}</p><button className="primary intro-btn" onClick={goProducts}>{isArabic?"استكشف المنتجات":"Explore products"}</button></section><Footer isArabic={isArabic} onProducts={goProducts} onGroup={goGroup} onAuth={goAccount}/></>}
 {page==='products'&&<ProductsPage onOpen={openProduct}/>}
 {page==='product'&&<ProductDetailsPage id={productId} onBack={goProducts}/>}
 {page==='checkout'&&<CheckoutPage onBack={()=>setCartOpen(true)} onLogin={()=>navigate('auth')} onSuccess={()=>navigate('account')}/>}
 {page==='auth'&&<AuthPage onSuccess={afterLogin} language={language} onLanguage={toggleLanguage} darkMode={darkMode} onTheme={toggleTheme}/>}
 {page==='login'&&<LoginPage onSuccess={afterLogin} onRegister={()=>setPage('auth')}/>}
 {page==='register'&&<RegisterPage onSuccess={afterLogin} onLogin={()=>setPage('auth')}/>}
 {page==='tracking'&&<OrderTrackingPage onBack={goAccount} onOrder={id=>{setOrderId(id);navigate('order')}}/>}
 {page==='account'&&<AccountPage onLogout={()=>{logout();setPage('auth')}} onOrder={id=>{setOrderId(id);navigate('order')}} onGroup={id=>{setGroupId(id);navigate('group-detail')}} onQuote={id=>{setQuoteId(id);navigate('quote-detail')}} onTracking={()=>navigate('tracking')}/>}
 {page==='order'&&<OrderDetailsPage id={orderId} onBack={()=>navigate('account')}/>}
 {page==='group'&&<GroupOrderPage onBack={()=>navigate('home')}/>}
 {page==='group-detail'&&<GroupOrderDetailsPage id={groupId} onBack={()=>navigate('account')}/>}
 {page==='quote-detail'&&<QuoteDetailsPage id={quoteId} onBack={()=>navigate('account')}/>}
 {page==='admin-login'&&<AdminLoginPage onSuccess={()=>navigate('admin')} onBack={()=>navigate('home')}/>}
 {page==='admin'&&<AdminDashboardPage onLogout={()=>navigate('admin-login')} onBack={()=>navigate('home')}/>} 
 {page!=='auth'&&<a className="wa" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER||"201000000000"}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24}/></a>}
 {cartToast&&<div className="cart-toast"><ShoppingBag size={18}/><span>{isArabic?'اتضاف للسلة':'Added to cart'}<b>{cartToast}</b></span></div>}<CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/>
</main></LanguageProvider>
}
export default function App(){return <ErrorBoundary><AuthProvider><CartProvider><AppInner/></CartProvider></AuthProvider></ErrorBoundary>}
