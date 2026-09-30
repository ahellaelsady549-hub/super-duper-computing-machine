const API_BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';

async function request(path,options={}){
 const token=localStorage.getItem('reflect_token');
 const headers={...(options.headers||{})};
 if(!(options.body instanceof FormData))headers['Content-Type']='application/json';
 if(token)headers.Authorization=`Bearer ${token}`;
 const response=await fetch(`${API_BASE}${path}`,{...options,headers});
 const data=await response.json().catch(()=>null);
 if(!response.ok)throw new Error(data?.message||'Request failed');
 return data;
}
export const catalogApi={
 categories:()=>request('/catalog/categories'),
 products:(params={})=>{const q=new URLSearchParams();Object.entries(params).forEach(([k,v])=>v!==undefined&&v!==''&&q.set(k,v));return request(`/catalog/products${q.toString()?`?${q}`:''}`)},
 product:(id)=>request(`/catalog/products/${id}`)
};
export const authApi={
 register:(body)=>request('/auth/register',{method:'POST',body:JSON.stringify(body)}),
 login:(body)=>request('/auth/login',{method:'POST',body:JSON.stringify(body)}),
 adminLogin:(body)=>request('/auth/admin/login',{method:'POST',body:JSON.stringify(body)})
};
export const orderApi={
 create:(body)=>request('/orders',{method:'POST',body:JSON.stringify(body)}),
 mine:()=>request('/orders/mine'),
 get:(id)=>request(`/orders/${id}`)
};
export const customerApi={
 profile:()=>request('/customer/profile'),
 update:(body)=>request('/customer/profile',{method:'PUT',body:JSON.stringify(body)}),
 changePassword:(body)=>request('/customer/password',{method:'PUT',body:JSON.stringify(body)})
};
export const groupOrderApi={
 create:(formData)=>request('/group-orders',{method:'POST',body:formData}),
 mine:()=>request('/group-orders/mine'),
 get:(id)=>request(`/group-orders/${id}`)
};
export const quoteApi={
 mine:()=>request('/quotes/mine'),
 get:(id)=>request(`/quotes/${id}`),
 respond:(id,body)=>request(`/quotes/${id}/respond`,{method:'POST',body:JSON.stringify(body)})
};
export const engagementApi={
 reviews:(productId)=>request(`/engagement/products/${productId}/reviews`),
 addReview:(productId,body)=>request(`/engagement/products/${productId}/reviews`,{method:'POST',body:JSON.stringify(body)}),
 notifications:()=>request('/engagement/notifications'),
 readNotification:(id)=>request(`/engagement/notifications/${id}/read`,{method:'PATCH'}),
 faqs:()=>request('/engagement/faqs'),
 gallery:()=>request('/engagement/gallery'),
 experienceReviews:()=>request('/engagement/experience-reviews'),
 addExperienceReview:(body)=>request('/engagement/experience-reviews',{method:'POST',body:JSON.stringify(body)})
};
