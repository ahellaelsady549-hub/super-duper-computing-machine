import React,{createContext,useContext} from 'react';
const LanguageContext=createContext('ar');
export function LanguageProvider({language,children}){return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>}
export function useLanguage(){const language=useContext(LanguageContext);return {language,isArabic:language==='ar'};}
export const money=(value,isArabic)=>`${Number(value||0).toLocaleString(isArabic?'ar-EG':'en-US')} ${isArabic?'ج.م':'EGP'}`;
