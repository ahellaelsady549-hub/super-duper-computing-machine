import React,{useState} from 'react';
import {authApi} from '../services/api.js';
import {useAuth} from '../context/AuthContext.jsx';

export default function RegisterPage({onSuccess,onLogin}){
 const {save}=useAuth();const [form,setForm]=useState({fullName:'',email:'',password:'',phone:'',whatsapp:'',university:'',faculty:'',department:''});const [error,setError]=useState('');
 const update=e=>setForm({...form,[e.target.name]:e.target.value});
 async function submit(e){e.preventDefault();setError('');try{save(await authApi.register(form));onSuccess()}catch(e){setError(e.message)}}
 return <section className="auth-page"><div className="auth-card register-card"><span className="eyebrow">JOIN REFLECT</span><h1>إنشاء حساب</h1><form onSubmit={submit}><div className="register-grid">{[['fullName','الاسم الكامل'],['email','البريد الإلكتروني'],['password','كلمة المرور'],['phone','الهاتف'],['whatsapp','واتساب'],['university','الجامعة'],['faculty','الكلية'],['department','القسم']].map(([name,label])=><label key={name}>{label}<input name={name} type={name==='email'?'email':name==='password'?'password':'text'} value={form[name]} onChange={update} required={['fullName','email','password'].includes(name)}/></label>)}</div>{error&&<div className="form-error">{error}</div>}<button className="primary auth-submit">إنشاء الحساب</button></form><button className="link-btn" onClick={onLogin}>لديك حساب بالفعل؟ تسجيل الدخول</button></div></section>
}
