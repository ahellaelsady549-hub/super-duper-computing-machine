import React,{createContext,useContext,useEffect,useState} from 'react';

const AuthContext=createContext(null);
const TOKEN_KEY='reflect_token';
const USER_KEY='reflect_user';

export function AuthProvider({children}){
  const [token,setToken]=useState(()=>localStorage.getItem(TOKEN_KEY));
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem(USER_KEY))}catch{return null}});

  const save=(data)=>{
    localStorage.setItem(TOKEN_KEY,data.token);
    localStorage.setItem(USER_KEY,JSON.stringify(data.user));
    setToken(data.token);setUser(data.user);
  };
  const logout=()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);setToken(null);setUser(null)};
  return <AuthContext.Provider value={{token,user,isAuthenticated:!!token,save,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
export const authToken=()=>localStorage.getItem(TOKEN_KEY);
