import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import Auth, { Recover } from './pages/Auth'
import AppLayout from './layouts/AppLayout'
import { Dashboard, Module, Reports, Settings } from './pages/Workspace'
function Content(){
 const {session,demo,loading}=useStore()
 const location=useLocation()
 if(location.pathname==='/recuperar')return <Recover/>
 if(loading&&!session&&!demo)return <div className="loading-screen" role="status">Preparando seu fluxo…</div>
 if(!session&&!demo)return <Auth/>
 return <Routes><Route element={<AppLayout/>}>
 <Route path="/" element={<Dashboard/>}/>
 <Route path="/clientes" element={<Module key="clients" table="clients"/>}/>
 <Route path="/oportunidades" element={<Module key="opportunities" table="opportunities"/>}/>
 <Route path="/orcamentos" element={<Module key="quotes" table="quotes"/>}/>
 <Route path="/follow-ups" element={<Module key="followups" table="followups"/>}/>
 <Route path="/relatorios" element={<Reports/>}/>
 <Route path="/configuracoes" element={<Settings/>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Route></Routes>
}
export default function App(){return <StoreProvider><Content/></StoreProvider>}
