export const stages = ['Novo contato', 'Em preparação', 'Enviado', 'Em negociação', 'Aprovado', 'Perdido'];
export const quoteStatuses = ['Rascunho', 'Enviado', 'Aprovado', 'Recusado'];
export const money = cents => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(cents / 100);
export const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function toCents(value) {
 const parsed = Number(String(value).replace(',', '.'));
 const cents = Math.round(parsed * 100);
 if (!Number.isFinite(parsed) || parsed < 0 || cents > 100000000000) throw new Error('Informe um valor válido.');
 return cents;
}
export function quoteTotal(items, discount) {
 if (!Array.isArray(items) || items.length < 1 || items.length > 100) throw new Error('Informe de 1 a 100 itens.');
 let subtotal = 0;
 for (const item of items) {
  if (!item.description.trim() || item.description.trim().length > 200 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000000 || !Number.isInteger(item.unit_price_cents) || item.unit_price_cents < 0 || item.unit_price_cents > 1000000000) throw new Error('Revise a descrição, a quantidade e o preço de cada item.');
  subtotal += item.quantity * item.unit_price_cents;
 }
 if (!Number.isSafeInteger(discount) || discount < 0 || discount > subtotal || subtotal - discount > 100000000000) throw new Error('Desconto ou total inválido.');
 return subtotal - discount;
}
export function csv(rows) {
 return '\uFEFF' + rows.map(row => row.map(value => {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
 }).join(';')).join('\r\n');
}
