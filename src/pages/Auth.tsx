import { FormEvent, useState } from 'react'
import { ArrowRight, Layers, ShieldCheck, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../lib/store'
export default function Auth(){
 const {setDemo}=useStore()
 const [mode,setMode]=useState<'login'|'signup'|'reset'>('login')
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('')
 async function submit(e:FormEvent){
  e.preventDefault();if(!supabase)return
  setBusy(true);setMessage('')
  try{
   const result=mode==='reset'?await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/recuperar'}):
    mode==='signup'?await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin}}):await supabase.auth.signInWithPassword({email,password})
   if(result.error)throw result.error
   if(mode==='signup')setMessage('Cadastro recebido. Se necessário, confirme seu e-mail antes de entrar.')
   if(mode==='reset')setMessage('Se houver uma conta com esse e-mail, você receberá as instruções.')
  }catch(e){setMessage(e instanceof Error?e.message:'Não foi possível entrar.')}
  finally{setBusy(false)}
 }
 return <main className="auth-shell"><section className="auth-story"><div className="auth-brand">flow<span>.pay</span></div><p className="eyebrow">MENOS PLANILHAS. MAIS NEGÓCIOS.</p><h1>Seu próximo<br/>passo começa<br/>com um bom fluxo.</h1><p>Clientes, propostas e próximos contatos.<br/>Tudo no lugar para você vender com clareza.</p><div className="story-points"><span><Layers size={18}/> Sua operação conectada</span><span><TrendingUp size={18}/> Cada negociação à vista</span><span><ShieldCheck size={18}/> Uma conta só sua</span></div><small>GESTÃO COMERCIAL PARA QUEM FAZ ACONTECER</small></section>
 <section className="auth-form"><p className="eyebrow">BEM-VINDO AO FLOW.PAY</p><h2>{mode==='signup'?'Comece um novo fluxo':mode==='reset'?'Recupere seu acesso':'Bom ter você por aqui'}</h2><p className="muted">Versão de testes gratuita. Sem cartão de crédito.</p>
 <form onSubmit={submit}><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>{mode!=='reset'&&<label>Senha<input type="password" minLength={8} required autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label>}
 <button className="button primary" disabled={busy||!supabase}>{busy?'Aguarde…':mode==='signup'?'Criar minha conta':mode==='reset'?'Enviar instruções':'Entrar'}<ArrowRight size={16}/></button></form>
 {message&&<p role="status" className="notice">{message}</p>}{!supabase&&<p className="notice">Conexão com o servidor ainda não configurada. Explore a demonstração abaixo.</p>}
 <div className="auth-links"><button onClick={()=>{setMode(mode==='signup'?'login':'signup');setMessage('')}}>{mode==='signup'?'Já tenho conta':'Criar conta gratuita'}</button><button onClick={()=>{setMode(mode==='reset'?'login':'reset');setMessage('')}}>{mode==='reset'?'Voltar para entrar':'Esqueci minha senha'}</button></div>
 <div className="demo-entry"><span>Quer conhecer primeiro?</span><button className="button secondary" onClick={()=>setDemo(true)}>Explorar demonstração <ArrowRight size={16}/></button><small>Dados fictícios. Alterações duram apenas nesta sessão.</small></div></section></main>
}
export function Recover(){
 const [password,setPassword]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);const result=await supabase?.auth.updateUser({password});setMessage(result?.error?.message??'Senha atualizada. Você já pode voltar ao painel.');setBusy(false)}
 return <main className="recovery panel"><h1>Definir nova senha</h1><form onSubmit={submit}><label>Nova senha<input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy||!supabase} className="button primary">Salvar senha</button></form><p role="status">{message}</p><a href="/">Voltar ao painel</a></main>
}
