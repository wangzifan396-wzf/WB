
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('numSamples(44100,2)=88200', A.numSamples(44100,2)===88200);
ok('pcmBytes(44100,1,2,16)=176400', A.pcmBytes(44100,1,2,16)===176400);
ok('humanSize(176400)=172.27 KB', A.humanSize(176400)==='172.27 KB');
ok('COMMON len', A.COMMON.length===7);
console.log('SampleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
