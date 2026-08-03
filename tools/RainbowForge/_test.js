
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('len', A.rainbow('abc').length===3);
ok('color', typeof A.rainbow('a')[0].color==='string' && A.rainbow('a')[0].color.indexOf('hsl')===0);
ok('grad', A.rainbow('ab')[0].color!==A.rainbow('ab')[1].color);
console.log('RainbowForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
