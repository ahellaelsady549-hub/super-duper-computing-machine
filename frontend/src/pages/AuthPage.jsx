import React,{useState} from 'react';
import {Sparkles,ShieldCheck,PartyPopper,ArrowLeft,Eye,EyeOff,Globe2,Sun,Moon} from 'lucide-react';
import {authApi} from '../services/api.js';
import {useAuth} from '../context/AuthContext.jsx';

const perksAr=[
 ['خلي يومك مختلف','اختاري اللوك والـ vibe اللي شبهك.'],
 ['كل حاجة في مكانها','طلباتك وتفاصيلك محفوظة عندنا.'],
 ['الدفعة كلها؟ ولا يهمك','جهزي دفعتك من أول التصميم لحد التسليم.']
];
const perksEn=[
 ['Make it your moment','Pick the look and vibe that feels like you.'],
 ['Everything in one place','Your orders and details stay saved.'],
 ['Your whole class? Easy.','Plan the group from design to delivery.']
];

export default function AuthPage({onSuccess,language='ar',onLanguage,darkMode,onTheme}){
 const isArabic=language==='ar';
 const perks=isArabic?perksAr:perksEn;
 const {save}=useAuth();
 const [mode,setMode]=useState('register');
 const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [controlFx,setControlFx]=useState('');
 const [showPass,setShowPass]=useState(false);
 const [form,setForm]=useState({fullName:'',email:'',password:'',phone:'',whatsapp:'',university:'',faculty:'',department:''});
 const update=e=>setForm({...form,[e.target.name]:e.target.value});
 const switchMode=m=>{setMode(m);setError('');setShowPass(false)};
 const runControlFx=(name,fn)=>{setControlFx(name);fn();window.setTimeout(()=>setControlFx(''),520)};
 const changeLanguage=()=>runControlFx('language-switch',onLanguage);
 const changeTheme=()=>runControlFx('theme-switch',onTheme);
 async function submit(e){e.preventDefault();setError('');setLoading(true);try{
   const data=mode==='register'?await authApi.register(form):await authApi.login({email:form.email,password:form.password});
   save(data); onSuccess();
  }catch(e){setError(e.message||'حصلت مشكلة، جربي تاني.')}finally{setLoading(false)}}
 return <section className={`auth-landing ${controlFx}`}>
   <div className="auth-art">
    <div className="auth-orb orb-a"/><div className="auth-orb orb-b"/><div className="auth-grid"/>
    <div className="auth-brand"><img src="/reflect-logo.png" alt="REFLECT"/><span>GRADUATION & APPAREL</span></div>
    <div className="auth-copy">
      <span className="genz-pill"><Sparkles size={15}/> {isArabic?"أهلاً بيكي في REFLECT":"WELCOME TO REFLECT"}</span>
      <h1>{isArabic?<>يوم التخرج؟<br/><span>اعمليه على مزاجك.</span></>:<>Graduation day?<br/><span>Make it yours.</span></>}</h1>
      <p>{isArabic?"إحنا نهتم بالتفاصيل، وإنتِ عيشي اللحظة. من أول الـ outfit لحد آخر صورة.":"We handle the details, you live the moment — from the outfit to the last photo."}</p>
      <div className="auth-perks">{perks.map(([title,text],i)=><div className="auth-perk" key={title}><span className="perk-icon">{i===0?<Sparkles/>:i===1?<ShieldCheck/>:<PartyPopper/>}</span><div><b>{title}</b><small>{text}</small></div></div>)}</div>
    </div>
    <div className="floating-sticker">YOUR MOMENT.<br/><strong>REFLECT IT</strong></div>
   </div>
   <div className="auth-panel">
    <div className="auth-panel-top"><button className="mini-logo" type="button" aria-label="REFLECT"><img src="/reflect-logo.png" alt="REFLECT"/></button><div className="auth-tools"><button onClick={changeLanguage} className={`auth-tool ${controlFx==='language-switch'?'is-switching':''}`} title="Language"><Globe2 size={16}/><span>{isArabic?"EN":"عربي"}</span></button><button onClick={changeTheme} className={`auth-tool ${controlFx==='theme-switch'?'is-switching':''}`} title="Theme">{darkMode?<Sun size={16}/>:<Moon size={16}/>}</button></div></div>
    <div className="auth-box">
      <div className="auth-tabs"><button className={mode==='register'?'active':''} onClick={()=>switchMode('register')}>{isArabic?"حساب جديد":"Create account"}</button><button className={mode==='login'?'active':''} onClick={()=>switchMode('login')}>{isArabic?"دخول":"Sign in"}</button></div>
      <div className="auth-heading"><span>{mode==='register'?'LET’S MAKE IT OFFICIAL':'WELCOME BACK'}</span><h2>{mode==='register'?(isArabic?'يلا نبدأ الحكاية':'Let’s get started'):(isArabic?'وحشتينا!':'Good to see you!')}</h2><p>{mode==='register'?(isArabic?'اعملي حسابك في دقيقة وخلينا نهتم بالباقي.':'Create your account in a minute and we’ll handle the rest.'):(isArabic?'دخلي بياناتك ونكمّل من حيث وقفنا.':'Sign in and pick up where you left off.')}</p></div>
      <form onSubmit={submit} className="modern-auth-form">
       {mode==='register'&&<label>{isArabic?"اسمك إيه؟":"What’s your name?"}<input name="fullName" placeholder="مثلاً: فاطمة علي" value={form.fullName} onChange={update} required/></label>}
       <label>{isArabic?"الإيميل":"Email"}<input name="email" type="email" placeholder="name@example.com" value={form.email} onChange={update} required/></label>
       {mode==='register'&&<div className="two-inputs"><label>{isArabic?"الموبايل":"Phone"}<input name="phone" placeholder="01xxxxxxxxx" value={form.phone} onChange={update}/></label><label>{isArabic?"واتساب":"WhatsApp"}<input name="whatsapp" placeholder="01xxxxxxxxx" value={form.whatsapp} onChange={update}/></label></div>}
       <label>{isArabic?"الباسورد":"Password"}<div className="password-wrap"><input name="password" type={showPass?'text':'password'} placeholder="••••••••" value={form.password} onChange={update} minLength={6} required/><button type="button" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
       {mode==='register'&&<div className="two-inputs"><label>{isArabic?"الجامعة":"University"}<input name="university" placeholder="جامعتك" value={form.university} onChange={update}/></label><label>{isArabic?"الكلية":"Faculty"}<input name="faculty" placeholder="كليتك" value={form.faculty} onChange={update}/></label></div>}
       {error&&<div className="form-error">{error}</div>}
       <button className="auth-main-btn" disabled={loading}>{loading?(isArabic?'لحظة بس...':'Just a sec...'):(mode==='register'?(isArabic?'اعملي الحساب':'Create my account'):(isArabic?'دخول على REFLECT':'Sign in to REFLECT'))}<ArrowLeft size={18}/></button>
      </form>
      <p className="auth-switch">{mode==='register'?(isArabic?'عندك حساب بالفعل؟':'Already have an account?'):(isArabic?'لسه جديدة هنا؟':'New here?')} <button onClick={()=>switchMode(mode==='register'?'login':'register')}>{mode==='register'?(isArabic?'سجلي دخول':'Sign in'):(isArabic?'اعملي حساب':'Create account')}</button></p>
    </div>
    <small className="auth-note">{isArabic?"بإنشاء الحساب إنتِ موافقة على الشروط وسياسة الخصوصية.":"By creating an account, you agree to the terms and privacy policy."}</small>
   </div>
 </section>
}
