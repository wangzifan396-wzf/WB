
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('hello', A.sponge('hello')==='HeLlO');
ok('num', A.sponge('a1b')==='A1b');
ok('lower', A.sponge('abc').toLowerCase()==='aBc'.toLowerCase());
console.log('SpongeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
