
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var d=A.makeMemoDeck(8);
ok('len', d.length===16);
ok('pairs', (function(){ var cnt={}; d.forEach(function(x){cnt[x]=(cnt[x]||0)+1;}); return Object.keys(cnt).length===8 && Object.keys(cnt).every(function(k){return cnt[k]===2;}); })());
ok('match', A.memoMatch([1,2,1,2],0,2)===true);
ok('no self', A.memoMatch([1,2,3,4],0,1)===false);
console.log('MemoryForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
