import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Data, Table, Profile } from './types'
import { today } from './domain.mjs'
const blank = ():Data => ({clients:[],opportunities:[],quotes:[],followups:[],profile:{company_name:'Minha empresa',contact_email:'',phone:''}})
const demoData = ():Data => {
 const created_at = new Date().toISOString()
 return { ...blank(), profile:{company_name:'Ateliê exemplo',contact_email:'contato@exemplo.com',phone:''},
 clients:[{id:'demo-client',name:'Mariana Costa',email:'mariana@example.com',phone:'',notes:'Cliente fictício para explorar o sistema.',created_at}],
 opportunities:[{id:'demo-opportunity',client_id:'demo-client',title:'Kit personalizado',value_cents:48000,stage:'Em negociação',notes:'',created_at}],
 quotes:[{id:'demo-quote',client_id:'demo-client',title:'Kit personalizado',items:[{description:'Peça personalizada',quantity:12,unit_price_cents:4000}],discount_cents:0,total_cents:48000,status:'Enviado',valid_until:today(),notes:'Orçamento demonstrativo.',created_at}],
 followups:[{id:'demo-followup',client_id:'demo-client',title:'Retomar proposta',due_date:today(),done:false,notes:'',created_at}]}
}
interface Store {
 data:Data; session:Session|null; demo:boolean; loading:boolean; error:string;
 setDemo:(value:boolean)=>void; reload:()=>Promise<void>; logout:()=>Promise<void>;
 save:(table:Table, value:Record<string,unknown>)=>Promise<void>; saveProfile:(profile:Profile)=>Promise<void>;
}
const Context = createContext<Store|null>(null)
export function StoreProvider({children}:{children:ReactNode}) {
 const [data,setData]=useState<Data>(blank)
 const [session,setSession]=useState<Session|null>(null)
 const [demo,setDemoState]=useState(false)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const generation=useRef(0)
 useEffect(()=>{
  if(!supabase){setLoading(false);return}
  let active=true
  supabase.auth.getSession().then(({data,error})=>{if(active){setSession(data.session);if(error)setError(error.message);setLoading(false)}})
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>{generation.current++;setSession(s);setData(blank())})
  return ()=>{active=false;subscription.unsubscribe()}
 },[])
 async function reload() {
  if(demo)return
  const request=++generation.current
  if(!supabase||!session){setData(blank());return}
  setLoading(true);setError('')
  try {
   const [clients,opportunities,quotes,followups,profile]=await Promise.all([
    supabase.from('clients').select('*').order('created_at',{ascending:false}),
    supabase.from('opportunities').select('*').order('created_at',{ascending:false}),
    supabase.from('quotes').select('*').order('created_at',{ascending:false}),
    supabase.from('followups').select('*').order('due_date'),
    supabase.from('profiles').select('*').maybeSingle()
   ])
   for(const r of [clients,opportunities,quotes,followups,profile])if(r.error)throw r.error
   if(request===generation.current)setData({clients:clients.data!,opportunities:opportunities.data!,quotes:quotes.data!,followups:followups.data!,profile:profile.data??blank().profile})
  }catch(e){if(request===generation.current)setError(e instanceof Error?e.message:'Não foi possível carregar os dados.')}
  finally{if(request===generation.current)setLoading(false)}
 }
 useEffect(()=>{if(!demo)void reload()},[session?.user.id,demo])
 function setDemo(value:boolean){generation.current++;setDemoState(value);setError('');setLoading(false);setData(value?demoData():blank())}
 async function save(table:Table,value:Record<string,unknown>){
  if(demo){
   setData(d=>{const rows=d[table] as unknown as Record<string,unknown>[];const record={...value,id:value.id??crypto.randomUUID(),created_at:value.created_at??new Date().toISOString()};
    return {...d,[table]:value.id?rows.map(r=>r.id===value.id?{...r,...record}:r):[record,...rows]}})
   return
  }
  if(!supabase||!session)throw new Error('Entre na sua conta para salvar.')
  const payload={...value,user_id:session.user.id}
  const result=value.id?await supabase.from(table).update(payload).eq('id',value.id):await supabase.from(table).insert(payload)
  if(result.error)throw new Error(result.error.message)
  await reload()
 }
 async function saveProfile(profile:Profile){
  if(demo){setData(d=>({...d,profile}));return}
  if(!supabase||!session)throw new Error('Entre na sua conta.')
  const result=await supabase.from('profiles').upsert({...profile,user_id:session.user.id})
  if(result.error)throw new Error(result.error.message)
  await reload()
 }
 async function logout(){
  if(demo){setDemo(false);return}
  if(supabase){const result=await supabase.auth.signOut();if(result.error)throw result.error}
 }
 return <Context.Provider value={{data,session,demo,loading,error,setDemo,reload,save,saveProfile,logout}}>{children}</Context.Provider>
}
export function useStore(){const value=useContext(Context);if(!value)throw new Error('Store ausente');return value}
