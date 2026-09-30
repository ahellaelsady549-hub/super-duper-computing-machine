import React,{useState} from 'react';
import {authApi} from '../services/api.js';
import {useAuth} from '../context/AuthContext.jsx';

export default function LoginPage({onSuccess,onRegister}){
 const {save}=useAuth(); const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 async function submit(e){e.preventDefault();setError('');setLoading(true);try{const data=await authApi.login({email,password});save(data);onSuccess()}catch(e){setError(e.message)}finally{setLoading(false)}}
 return <section className="auth-page"><div className="auth-card"><span className="eyebrow">WELCOME TO REFLECT</span><h1>تسجيل الدخول</h1><p>ادخلي إلى حسابك لمتابعة الطلبات وإتمام الشراء.</p><form onSubmit={submit}><label>البريد الإلكتروني<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>كلمة المرور<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<div className="form-error">{error}</div>}<button className="primary auth-submit" disabled={loading}>{loading?'جاري الدخول...':'دخول'}</button></form><button className="link-btn" onClick={onRegister}>ليس لديك حساب؟ إنشاء حساب</button></div></section>
}
