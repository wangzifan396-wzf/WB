
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deck', A.DECK.length===78);
ok('draw3', A.draw(3).length===3);
ok('distinct', (function(){var d=A.draw(10),seen={},ok=true; d.forEach(function(x){if(seen[x])ok=false;seen[x]=1;}); return ok;})());
console.log('TarotForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
