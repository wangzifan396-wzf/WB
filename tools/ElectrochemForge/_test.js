
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('Zn/Cu =1.10', A.emf('Cu2+/Cu','Zn2+/Zn')===1.10);
ok('reverse = -1.10', A.emf('Zn2+/Zn','Cu2+/Cu')===-1.10);
ok('reverse nonspontaneous', A.spontaneous('Zn2+/Zn','Cu2+/Cu')===false);
ok('unknown null', A.emf('X/Y','Zn2+/Zn')===null);
console.log('ElectrochemForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
