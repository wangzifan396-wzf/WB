
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.generate({sidebar:true});
ok('has header', g.indexOf('wf-header')>=0);
ok('has sidebar', g.indexOf('wf-sidebar')>=0);
ok('has main/footer', g.indexOf('wf-main')>=0 && g.indexOf('wf-footer')>=0);
ok('no sidebar when off', A.generate({}).indexOf('wf-sidebar')<0);
console.log('WireframeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
