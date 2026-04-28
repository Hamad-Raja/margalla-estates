import { createContext, useContext, useMemo, useState } from 'react';
import React from 'react';
import api from '../services/api';
const Ctx = createContext(null);
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('margalla_user')||'null'));
  const [loading,setLoading]=useState(false);
  async function login(payload){setLoading(true);try{const {data}=await api.post('/auth/login',payload);localStorage.setItem('margalla_token',data.token);localStorage.setItem('margalla_user',JSON.stringify(data.user));setUser(data.user);return data.user;}finally{setLoading(false)}}
  async function register(payload){setLoading(true);try{const {data}=await api.post('/auth/register',payload);localStorage.setItem('margalla_token',data.token);localStorage.setItem('margalla_user',JSON.stringify(data.user));setUser(data.user);return data.user;}finally{setLoading(false)}}
  function logout(){localStorage.removeItem('margalla_token');localStorage.removeItem('margalla_user');setUser(null)}
  return <Ctx.Provider value={useMemo(()=>({user,loading,login,register,logout}),[user,loading])}>{children}</Ctx.Provider>
}
export const useAuth=()=>useContext(Ctx);
