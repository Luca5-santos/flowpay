import test from 'node:test'
import assert from 'node:assert/strict'
import { toCents, quoteTotal, csv, today } from '../src/lib/domain.mjs'
test('converts BRL decimals without floating point residue',()=>{
 assert.equal(toCents('12,99'),1299)
 assert.equal(toCents('0.29'),29)
 assert.throws(()=>toCents('-1'))
 assert.throws(()=>toCents('abc'))
})
test('calculates quantity, discount and total',()=>{
 assert.equal(quoteTotal([{description:'Peça',quantity:3,unit_price_cents:1299}],100),3797)
 assert.equal(quoteTotal([{description:'Cortesia',quantity:1,unit_price_cents:0}],0),0)
})
test('rejects malformed quote items and discounts',()=>{
 for(const items of [[],[{description:'',quantity:1,unit_price_cents:100}],[{description:'Peça',quantity:1.5,unit_price_cents:100}],[{description:'Peça',quantity:1,unit_price_cents:-1}]]){
  assert.throws(()=>quoteTotal(items,0))
 }
 assert.throws(()=>quoteTotal([{description:'Peça',quantity:1,unit_price_cents:100}],101))
 assert.throws(()=>quoteTotal([{description:'Peça',quantity:1,unit_price_cents:100}],-1))
})
test('CSV escapes separators and blocks spreadsheet formulas',()=>{
 const result=csv([['=1+1',' +SUM(A1)','a;"b"','normal']])
 assert.ok(result.startsWith('\uFEFF'))
 assert.ok(result.includes('"\'=1+1"'))
 assert.ok(result.includes('"\' +SUM(A1)"'))
 assert.ok(result.includes('"a;""b"""'))
})
test('business date is ISO format',()=>assert.match(today(),/^\d{4}-\d{2}-\d{2}$/))
