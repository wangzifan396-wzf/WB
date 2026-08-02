const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('parseCsv basic', JSON.stringify(A.parseCsv('a,b,c\n1,2,3'))===JSON.stringify([['a','b','c'],['1','2','3']]));
ok('parseCsv quoted comma', JSON.stringify(A.parseCsv('a,"b,c",d'))===JSON.stringify([['a','b,c','d']]));
ok('parseCsv quoted newline', JSON.stringify(A.parseCsv('a,"x\ny",b'))===JSON.stringify([['a','x\ny','b']]));
ok('toCsv quote', A.toCsv([['a','b,c']])==='a,"b,c"');
ok('roundtrip', JSON.stringify(A.parseCsv(A.toCsv([['a','b,c'],['1','2']])))===JSON.stringify([['a','b,c'],['1','2']]));
ok('toObjects header', JSON.stringify(A.toObjects([['h1','h2'],['1','2']],true))===JSON.stringify([{h1:'1',h2:'2'}]));
ok('transpose', JSON.stringify(A.transpose([[1,2],[3,4]]))===JSON.stringify([[1,3],[2,4]]));
ok('summarize rows', A.summarize([['a','b'],['1','2']],true).rows===2);
console.log('CsvForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
