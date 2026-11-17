import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { FileText, LayoutDashboard, LogOut, Menu, Settings, Target, Users, CalendarClock, ChartNoAxesCombined, RefreshCw } from 'lucide-react'
import Logo from '../components/Logo'
import { useState } from 'react'
import { useStore } from '../lib/store'
import { today } from '../lib/domain.mjs'
const nav=[
 {to:'/',label:'Visão geral',icon:LayoutDashboard},
 {to:'/clientes',label:'Clientes',icon:Users},
 {to:'/oportunidades',label:'Oportunidades',icon:Target},
 {to:'/orcamentos',label:'Orçamentos',icon:FileText},
 {to:'/follow-ups',label:'Follow-ups',icon:CalendarClock},
 {to:'/relatorios',label:'Relatórios',icon:ChartNoAxesCombined},
]
export default function AppLayout(){
 const {data,session,demo,loading,error,reload,logout}=useStore()
 const [mobileOpen,setMobileOpen]=useState(false),[message,setMessage]=useState('')
 const location=useLocation()
 const title=nav.find(n=>n.to===location.pathname)?.label??'Configurações'
 const due=data.followups.filter(f=>!f.done&&f.due_date<=today()).length
 async function leave(){try{await logout()}catch(e){setMessage(e instanceof Error?e.message:'Não foi possível sair.')}}
 return <div className="app-shell"><aside className={'sidebar '+(mobileOpen?'sidebar-open':'')}>
 <Link className="brand" to="/" aria-label="Flow.pay — início"><Logo inverse/></Link>
 <div className="workspace"><div className="workspace-avatar">{data.profile.company_name.slice(0,1).toUpperCase()}</div><div><strong>{data.profile.company_name}</strong><small>{demo?'Demonstração':'Plano de testes gratuito'}</small></div></div>
 <p className="nav-caption">SEU ESPAÇO DE NEGÓCIOS</p><nav className="nav-list">{nav.map(({to,label,icon:Icon})=><NavLink to={to} key={to} end={to==='/'} onClick={()=>setMobileOpen(false)} className={({isActive})=>'nav-link '+(isActive?'active':'')}><Icon size={18}/><span>{label}</span>{to==='/follow-ups'&&due>0&&<i className="nav-count">{due}</i>}</NavLink>)}</nav>
 <div className="sidebar-bottom"><div className="help-card"><strong>Um passo de cada vez.</strong><p>Cadastre um cliente, crie uma proposta e agende o próximo contato.</p><Link to="/clientes">Começar pelos clientes →</Link></div><NavLink to="/configuracoes" className="nav-link"><Settings size={18}/>Configurações</NavLink><button className="nav-link logout" onClick={()=>void leave()}><LogOut size={18}/>{demo?'Sair da demonstração':'Sair da conta'}</button><div className="profile"><div className="profile-avatar">{demo?'DE':(session?.user.email??'FL').slice(0,2).toUpperCase()}</div><div><strong>{demo?'Visitante':session?.user.email}</strong><small>Seu fluxo, organizado.</small></div></div></div></aside>
 {mobileOpen&&<button className="mobile-scrim" aria-label="Fechar menu" onClick={()=>setMobileOpen(false)}/>}
 <main className="main-area"><header className="topbar"><button className="mobile-menu" aria-label="Abrir menu" onClick={()=>setMobileOpen(!mobileOpen)}><Menu size={21}/></button><div className="breadcrumb">Meu espaço <span>/</span><strong>{title}</strong></div><div className="top-actions"><span className="beta-label">BETA GRATUITO</span><button className="icon-button" aria-label="Atualizar dados" disabled={loading||demo} onClick={()=>void reload()}><RefreshCw size={17}/></button></div></header>
 {demo&&<div className="demo-strip">Você está explorando dados fictícios. Alterações não são salvas ao sair.</div>}
 {(error||message)&&<div className="notice" role="alert">{error||message} <button onClick={()=>void reload()}>Tentar novamente</button></div>}
 {loading&&<p className="sync-status" role="status">Sincronizando dados…</p>}
 <div className="content"><Outlet/></div></main></div>
}
