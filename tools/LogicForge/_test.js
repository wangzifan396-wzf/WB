
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function ev(expr,asg){return A.logicEval(A.logicParse(A.logicTokens(expr)),asg);}
ok('and', ev('A & B',{A:1,B:1})===1 && ev('A & B',{A:1,B:0})===0);
ok('or', ev('A | B',{A:0,B:0})===0 && ev('A | B',{A:0,B:1})===1);
ok('xor', ev('A ^ B',{A:1,B:1})===0 && ev('A ^ B',{A:1,B:0})===1);
ok('not', ev('!A',{A:1})===0);
ok('imply', ev('A -> B',{A:1,B:0})===0 && ev('A -> B',{A:0,B:0})===1);
ok('equiv', ev('A <-> B',{A:1,B:0})===0 && ev('A <-> B',{A:1,B:1})===1);
ok('complex', ev('(A & B) | (!A & C)',{A:1,B:0,C:1})===0 && ev('(A & B) | (!A & C)',{A:0,B:0,C:1})===1);
console.log('LogicForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
