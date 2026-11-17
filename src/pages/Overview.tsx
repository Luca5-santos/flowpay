import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Plus, Users, Target, FileCheck2, Wallet, Sparkles, CalendarClock, Check } from 'lucide-react'
import { useStore } from '../lib/store'
import { money, stages, today } from '../lib/domain.mjs'
const colors=['#8eaaa0','#76a88c','#7f94b2','#d4a165','#247d64','#b77979']
export default function Overview() {
 const {data}=useStore()
 const active=data.opportunities.filter(o=>!['Aprovado','Perdido'].includes(o.stage))
 const due=data.followups.filter(f=>!f.done&&f.due_date<=today())
 const upcoming=data.followups.filter(f=>!f.done).sort((a,b)=>a.due_date.localeCompare(b.due_date))
 const approved=data.quotes.filter(q=>q.status==='Aprovado')
 const openValue=active.reduce((sum,o)=>sum+o.value_cents,0)
 const dateLabel=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',timeZone:'America/Sao_Paulo'}).format(new Date())
 const next=upcoming[0]
 const nextClient=data.clients.find(c=>c.id===next?.client_id)
 const stats=[
  {label:'Clientes na sua rede',value:data.clients.length,detail:'Relacionamentos para cultivar',Icon:Users},
  {label:'Negócios em movimento',value:active.length,detail:'Oportunidades em aberto',Icon:Target},
  {label:'Propostas aprovadas',value:approved.length,detail:'Conversas que viraram negócio',Icon:FileCheck2},
  {label:'Potencial de vendas',value:money(openValue),detail:'Valor total em negociação',Icon:Wallet}
 ]
 return <section className="page overview-page">
  <div className="overview-heading"><div><p className="eyebrow">{dateLabel}</p><h1>Seu negócio tem ritmo.</h1><p className="muted">Vamos manter as boas oportunidades em movimento.</p></div><Link className="button primary" to="/orcamentos?novo=1"><Plus size={17}/> Criar proposta</Link></div>
  <section className="flow-hero" aria-label="Resumo do seu fluxo comercial">
   <div className="hero-rings" aria-hidden="true"><i/><i/><i/><span><ArrowUpRight size={44}/></span></div>
   <div className="hero-message"><span className="hero-kicker"><i/> SEU FLUXO, NO CONTROLE</span><h2>Boas conversas.<br/>Grandes <em>possibilidades.</em></h2><p>Cada cliente é um começo. Cada próximo passo<br className="desktop-break"/> aproxima você de um novo negócio.</p>
   <div className="flow-milestones"><span><Users size={14}/> Conectar</span><i/><span><FileCheck2 size={14}/> Propor</span><i/><span><Check size={14}/> Fechar</span></div></div>
   <div className="next-move"><span className="next-move-caption"><CalendarClock size={16}/> SEU PRÓXIMO MOVIMENTO</span><h3>{next?next.title:'Abra uma nova conversa.'}</h3><p>{next?nextClient?.name??'Cliente cadastrado':'Uma oportunidade começa com alguém. Adicione seu primeiro cliente ou retome um contato.'}</p>
   <div className="next-move-bottom"><span>{next?(due.length?due.length+' retorno(s) para hoje':'Agendado para '+new Date(next.due_date+'T12:00:00').toLocaleDateString('pt-BR')):'Seu próximo negócio espera por você'}</span><Link to={next?'/follow-ups':'/clientes?novo=1'} aria-label={next?'Ver próximos retornos':'Cadastrar cliente'}><ArrowUpRight size={22}/></Link></div></div>
  </section>
  <div className="section-heading overview-section"><div><p className="eyebrow">O PULSO DA SUA OPERAÇÃO</p><h2>Pequenos passos. Resultados à vista.</h2></div><span className="live-caption"><i/> Dados da sua conta</span></div>
  <div className="metric-grid">{stats.map(({label,value,detail,Icon},i)=><article className={'metric-card metric-tone-'+i} key={label}><div className="metric-top"><span>{label}</span><div className="metric-icon"><Icon size={19}/></div></div><strong className="metric-value">{value}</strong><span className="metric-footnote">{detail}</span></article>)}</div>
  <div className="dashboard-grid">
   <article className="panel flow-pipeline"><div className="panel-heading"><div><p className="eyebrow">DO CONTATO À CONQUISTA</p><h2>Onde os negócios estão</h2></div><Link className="text-button" to="/oportunidades">Ver funil <ArrowUpRight size={16}/></Link></div>
   <div className="pipeline-total"><strong>{data.opportunities.length.toString().padStart(2,'0')}</strong><span>oportunidades<br/>no seu fluxo</span></div>
   <div className="flow-distribution" aria-label="Distribuição das oportunidades por etapa">{data.opportunities.length?stages.map((stage,i)=>{const count=data.opportunities.filter(o=>o.stage===stage).length;return count>0?<div key={stage} title={stage+': '+count} style={{flex:count,background:colors[i]}}/>:null}):<div className="distribution-empty"/>}</div>
   <div className="pipeline-list">{stages.map((stage,i)=><div className="pipeline-item" key={stage}><span className="pipeline-dot" style={{background:colors[i]}}/>{stage}<strong>{data.opportunities.filter(o=>o.stage===stage).length.toString().padStart(2,'0')}</strong></div>)}</div></article>
   <article className="panel agenda-panel"><div className="panel-heading"><div><p className="eyebrow">PRESENÇA FAZ DIFERENÇA</p><h2>Não deixe a conversa esfriar</h2></div><span className="agenda-icon"><CalendarClock size={21}/></span></div>
    {upcoming.slice(0,3).map(f=><Link className="agenda-row" key={f.id} to="/follow-ups"><span className={'agenda-date '+(f.due_date<=today()?'agenda-date-due':'')}><strong>{new Date(f.due_date+'T12:00:00').getDate().toString().padStart(2,'0')}</strong><small>{new Date(f.due_date+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'}).replace('.','')}</small></span><span><strong>{f.title}</strong><small>{data.clients.find(c=>c.id===f.client_id)?.name}</small></span><ArrowUpRight size={18}/></Link>)}
    {!upcoming.length&&<div className="agenda-empty"><Sparkles size={26}/><strong>Uma agenda leve, por enquanto.</strong><p>Agende seu próximo contato e transforme intenção em movimento.</p></div>}
    <Link className="agenda-all" to="/follow-ups">Organizar meus retornos <ArrowRight size={15}/></Link></article>
  </div>
  <article className="panel proposals-panel"><div className="panel-heading"><div><p className="eyebrow">IDEIAS QUE GANHAM FORMA</p><h2>Suas últimas propostas</h2></div><Link className="text-button" to="/orcamentos">Ver todas <ArrowUpRight size={16}/></Link></div><div className="table-wrap"><table><thead><tr><th>PROPOSTA</th><th>CLIENTE</th><th>VALOR</th><th>ANDAMENTO</th></tr></thead><tbody>{data.quotes.slice(0,5).map(q=><tr key={q.id}><td><Link className="proposal-title" to="/orcamentos"><span className="proposal-dot"/>{q.title}</Link></td><td>{data.clients.find(c=>c.id===q.client_id)?.name}</td><td className="proposal-value">{money(q.total_cents)}</td><td><span className={'proposal-status status-'+q.status.toLowerCase()}><i/>{q.status}</span></td></tr>)}</tbody></table></div>{!data.quotes.length&&<div className="proposals-empty"><FileCheck2 size={27}/><div><strong>Sua primeira proposta pode começar agora.</strong><p>Reúna os detalhes, escolha um cliente e dê o próximo passo.</p></div><Link className="button secondary" to="/orcamentos?novo=1">Criar proposta <ArrowUpRight size={16}/></Link></div>}</article>
  <footer className="flow-footer"><span><i/> Feito para o seu negócio fluir.</span><strong>flow.pay</strong></footer>
 </section>
}
