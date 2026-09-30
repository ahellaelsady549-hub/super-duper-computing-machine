import React from 'react';
export default class ErrorBoundary extends React.Component{
 state={hasError:false};
 static getDerivedStateFromError(){return {hasError:true}};
 componentDidCatch(error,info){console.error('REFLECT UI error',error,info)}
 render(){if(this.state.hasError)return <main className="error-page"><div><span className="eyebrow">REFLECT</span><h1>حصل خطأ غير متوقع</h1><p>جربي تحديث الصفحة، ولو المشكلة استمرت ارجعي للصفحة الرئيسية.</p><button className="primary" onClick={()=>window.location.reload()}>تحديث الصفحة</button></div></main>;return this.props.children}
}
