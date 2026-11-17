export default function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
 return <span className={'flow-logo'+(inverse?' flow-logo-inverse':'')}>
  <img src="/flowpay-symbol.png" alt="" width="44" height="44" decoding="async" />
  {!compact && <span className="flow-wordmark">flow<span>.pay</span><small>GESTÃO COMERCIAL</small></span>}
 </span>
}
