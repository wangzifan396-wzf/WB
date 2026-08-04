
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.rvNew(); ok('init legal', A.rvLegal(b,'B').length===4);
ok('apply flips', (function(){var nb=A.rvApply(b,2,3,'B'); return nb!==null && A.rvCount(nb,'B')===4;})());
ok('black 2', A.rvCount(b,'B')===2);
ok('white 2', A.rvCount(b,'W')===2);
ok('no flip', A.rvApply(b,0,0,'B')===null);
console.log('ReversiForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
