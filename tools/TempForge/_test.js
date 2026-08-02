const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b){ return Math.abs(a-b)<1e-6; }
ok('0C -> 32F', near(A.convertTemp(0,'c','f'),32));
ok('100C -> 212F', near(A.convertTemp(100,'c','f'),212));
ok('0C -> 273.15K', near(A.convertTemp(0,'c','k'),273.15));
ok('32F -> 0C', near(A.convertTemp(32,'f','c'),0));
ok('273.15K -> 0C', near(A.convertTemp(273.15,'k','c'),0));
ok('0C -> 491.67R', near(A.convertTemp(0,'c','r'),491.67));
ok('212F -> 373.15K', near(A.convertTemp(212,'f','k'),373.15));
ok('roundtrip C', near(A.convertTemp(A.convertTemp(25,'c','f'),'f','c'),25));
ok('roundtrip K', near(A.convertTemp(A.convertTemp(300,'k','r'),'r','k'),300));
ok('fmt', A.fmt(3.1415926535)==='3.1416');
ok('bad unit throws', (function(){try{A.convertTemp(1,'x','c');return false;}catch(e){return true;}})());
console.log('TempForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
