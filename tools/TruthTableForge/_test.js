
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('vars',A.getVars('A & B | C').join(',')==='A,B,C');
ok('rows',A.table('A & B').rows.length===4);
ok('and11',A.evalExpr('A & B',{A:1,B:1})===1);
ok('and10',A.evalExpr('A & B',{A:1,B:0})===0);
var t=A.table('A | B');ok('or',t.rows[0].out===0&&t.rows[3].out===1);
ok('not',A.evalExpr('!A',{A:0})===1);
console.log('TruthTableForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
