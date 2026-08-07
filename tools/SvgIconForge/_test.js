
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.icon('star',24,'#000');
ok('svg root', s.indexOf('<svg')>=0 && s.indexOf('</svg>')>=0);
ok('star polygon', s.indexOf('polygon')>=0);
ok('default fallback', A.icon('unknown').indexOf('rect')>=0);
ok('size attr', A.icon('circle',64).indexOf('width="64"')>=0);
console.log('SvgIconForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
