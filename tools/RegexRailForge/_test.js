
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var a=P.rrParse('a'); ok(a.type==='lit'&&a.ch==='a','single lit');
var al=P.rrParse('a|b'); ok(al.type==='alt'&&al.options.length===2,'alt');
var q=P.rrParse('a*'); ok(q.type==='quant'&&q.q==='*'&&q.node.type==='lit','star');
var g=P.rrParse('(ab)+'); ok(g.type==='quant'&&g.node.type==='group'&&g.node.node.type==='cat','group quant');
var seq=P.rrParse('a?b'); ok(seq.type==='cat'&&seq.parts[0].type==='quant'&&seq.parts[1].type==='lit','opt then lit');
var svg=P.rrSvg(P.rrParse('a(b|c)*d+'));
ok(/<svg/.test(svg)&&/a/.test(svg),'svg contains literal a');
var threw=false; try{ P.rrParse('a(b'); }catch(e){ threw=true; }
ok(threw,'unbalanced throws');
console.log('PASS '+n+' assertions');
