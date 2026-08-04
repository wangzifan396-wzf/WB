
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.pegNew(); ok('32 pegs', A.pegPegs(g)===32);
ok('has moves', A.pegMoves(g).length>=4);
var mv=A.pegMoves(g)[0]; var ng=A.pegApply(g,mv); ok('apply reduces', A.pegPegs(ng)===31);
ok('apply null', A.pegApply(g,{from:[0,0],over:[0,0],to:[0,0]})===null);
console.log('PegSolitaireForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
