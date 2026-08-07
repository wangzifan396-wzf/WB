
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('decToBase(255,16)=ff', A.decToBase(255,16)==='ff');
ok('decToBase(10,2)=1010', A.decToBase(10,2)==='1010');
ok('baseToDec(ff,16)=255', A.baseToDec('FF',16)===255);
ok('convert(1010,2,10)="10"', A.convert('1010',2,10)==='10');
ok('convert(255,10,36)=73', A.convert('255',10,36)==='73');
ok('decToBase(0,2)=0', A.decToBase(0,2)==='0');
ok('neg decToBase(-10,2)=-1010', A.decToBase(-10,2)==='-1010');
console.log('NumberBaseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
