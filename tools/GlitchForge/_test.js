
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zero', A.glitch('abc',{intensity:0})==='abc');
ok('len', A.glitch('abc').length>=3);
ok('map', typeof A.GLITCH_MAP.a==='string');
console.log('GlitchForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
