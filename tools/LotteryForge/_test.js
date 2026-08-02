
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.pick(49,6,1,[],C.rngFrom(9));ok('len',r.value.tickets[0].length===6);ok('range',r.value.tickets[0].every(function(x){return x>=1&&x<=49;}));ok('sorted',JSON.stringify(r.value.tickets[0])===JSON.stringify(r.value.tickets[0].slice().sort(function(a,b){return a-b;})));
var r2=C.pick(10,3,2,[1,2]);ok('exclude',r2.value.tickets.every(function(t){return t.every(function(x){return x!==1&&x!==2;});}));
console.log((fail?'FAIL':'PASS')+' LotteryForge '+pass+'/'+fail);process.exit(fail?1:0);
