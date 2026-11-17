export interface Client { id:string; user_id?:string; name:string; email:string; phone:string; notes:string; created_at:string }
export interface Opportunity { id:string; user_id?:string; client_id:string; title:string; value_cents:number; stage:string; notes:string; created_at:string }
export interface QuoteItem { description:string; quantity:number; unit_price_cents:number }
export interface Quote { id:string; user_id?:string; client_id:string; title:string; items:QuoteItem[]; discount_cents:number; total_cents:number; status:string; valid_until:string; notes:string; created_at:string }
export interface Followup { id:string; user_id?:string; client_id:string; title:string; due_date:string; done:boolean; notes:string; created_at:string }
export interface Profile { company_name:string; contact_email:string; phone:string }
export interface Data { clients:Client[]; opportunities:Opportunity[]; quotes:Quote[]; followups:Followup[]; profile:Profile }
export type Table = 'clients' | 'opportunities' | 'quotes' | 'followups'
