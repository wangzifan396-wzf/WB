
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.cfNew(); ok('drop row', A.cfDrop(b,0,'R')===5);
ok('drop stack', A.cfDrop(b,0,'Y')===4);
ok('win horiz', (function(){var x=A.cfNew(); for(var c=0;c<4;c++) A.cfDrop(x,c,'R'); return A.cfWinner(x)==='R';})());
ok('win vert', (function(){var x=A.cfNew(); A.cfDrop(x,0,'R'); A.cfDrop(x,0,'R'); A.cfDrop(x,0,'R'); A.cfDrop(x,0,'R'); return A.cfWinner(x)==='R';})());
ok('no win', A.cfWinner(A.cfNew())===null);
console.log('ConnectForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
