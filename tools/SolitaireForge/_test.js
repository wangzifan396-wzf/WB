
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var st=A.slDeal(3);
ok('tableau 28', st.tableau.reduce(function(a,p){return a+p.length;},0)===28);
ok('stock 24', st.stock.length===24);
ok('top faceup', st.tableau.every(function(p){return p[p.length-1].f===true;}));
ok('foundation ace', A.slFoundationOk({r:1,s:'s'},{s:0,h:0,d:0,c:0})===true);
ok('foundation two', A.slFoundationOk({r:2,s:'s'},{s:1,h:0,d:0,c:0})===true);
ok('stack ok', A.slStackOk({r:5,s:'h'},{r:6,s:'s',f:true})===true);
ok('stack bad color', A.slStackOk({r:5,s:'h'},{r:6,s:'h',f:true})===false);
console.log('SolitaireForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
