const API_BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
async function request(path,options={}){
 const token=localStorage.getItem('reflect_token');
 const headers={'Content-Type':'application/json',...(options.headers||{})};
 if(token)headers.Authorization=`Bearer ${token}`;
 const response=await fetch(`${API_BASE}${path}`,{...options,headers});
 const data=await response.json().catch(()=>null);
 if(!response.ok)throw new Error(data?.message||'Request failed');
 return data;
}
const json=(method,body)=>({method,body:JSON.stringify(body)});
export const adminApi={
 dashboard:()=>request('/admin/dashboard'),
 notifications:()=>request('/admin/notifications'),
 readNotification:id=>request(`/admin/notifications/${id}/read`,{method:'PATCH'}),
 products:()=>request('/admin/products'),
 createProduct:b=>request('/admin/products',json('POST',b)),
 updateProduct:(id,b)=>request(`/admin/products/${id}`,json('PUT',b)),
 deleteProduct:id=>request(`/admin/products/${id}`,{method:'DELETE'}),
 categories:()=>request('/admin/categories'),
 createCategory:b=>request('/admin/categories',json('POST',b)),
 updateCategory:(id,b)=>request(`/admin/categories/${id}`,json('PUT',b)),
 deleteCategory:id=>request(`/admin/categories/${id}`,{method:'DELETE'}),
 customers:()=>request('/admin/customers'),
 orders:()=>request('/admin/orders'),
 updateOrder:(id,b)=>request(`/admin/orders/${id}`,json('PUT',b)),
 groupOrders:()=>request('/admin/group-orders'),
 updateGroupOrder:(id,b)=>request(`/admin/group-orders/${id}`,json('PUT',b)),
 quotes:()=>request('/admin/quotes'),
 createQuote:b=>request('/admin/quotes',json('POST',b)),
 updateQuote:(id,b)=>request(`/admin/quotes/${id}`,json('PUT',b)),
 reviews:()=>request('/admin/reviews'), updateReview:(id,b)=>request(`/admin/reviews/${id}`,json('PUT',b)),
 faqs:()=>request('/admin/faqs'), createFaq:b=>request('/admin/faqs',json('POST',b)), updateFaq:(id,b)=>request(`/admin/faqs/${id}`,json('PUT',b)), deleteFaq:id=>request(`/admin/faqs/${id}`,{method:'DELETE'}),
 experienceReviews:()=>request('/admin/experience-reviews'), updateExperienceReview:(id,b)=>request(`/admin/experience-reviews/${id}`,json('PUT',b)),
 gallery:()=>request('/admin/gallery'), createGallery:b=>request('/admin/gallery',json('POST',b)), updateGallery:(id,b)=>request(`/admin/gallery/${id}`,json('PUT',b)), deleteGallery:id=>request(`/admin/gallery/${id}`,{method:'DELETE'})
};
