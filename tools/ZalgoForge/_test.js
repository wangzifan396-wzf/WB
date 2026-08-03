
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('empty', A.zalgo('',{}).length===0);
ok('none', A.zalgo('a',{up:0,down:0,mid:0})==='a');
ok('adds', A.zalgo('ab',{up:3,down:3,mid:3}).length>2);
ok('spaces kept', A.zalgo('a b',{up:2}).indexOf(' ')>0);
console.log('ZalgoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
