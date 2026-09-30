import React,{useState} from 'react';
import {ShieldCheck} from 'lucide-react';
import {authApi} from '../services/api.js';
import {useAuth} from '../context/AuthContext.jsx';

export default function AdminLoginPage({onSuccess,onBack}){
 const {save}=useAuth();const [email,setEmail]=useState('reflect@gmail.com');const [password,setPassword]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 async function submit(e){e.preventDefault();setError('');setLoading(true);try{const data=await authApi.adminLogin({email,password});save(data);onSuccess()}catch(e){setError(e.message)}finally{setLoading(false)}}
 return <section className="admin-login"><div className="admin-login-card"><ShieldCheck size={40}/><span className="eyebrow">REFLECT ADMIN</span><h1>لوحة التحكم</h1><p>دخول مخصص لإدارة المتجر والطلبات.</p><form onSubmit={submit}><label>البريد الإلكتروني<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>كلمة المرور<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<div className="form-error">{error}</div>}<button className="primary">دخول لوحة التحكم</button></form><button className="link-btn" onClick={onBack}>العودة للموقع</button></div></section>
}
