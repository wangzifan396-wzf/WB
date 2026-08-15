
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('has svg', A.gen(100,50).indexOf('<svg')===0);
ok('dims', A.gen(100,50).indexOf('width="100"')>=0);
ok('text', A.gen(100,50,'Hi','#ddd','#333').indexOf('>Hi<')>=0);
console.log('SvgPlaceholderForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
