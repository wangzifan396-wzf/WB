
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('codonToAA AUG=Met', A.codonToAA('AUG')==='Met');
ok('codonToAA UUU=Phe', A.codonToAA('UUU')==='Phe');
ok('codonToAA UAA=Stop', A.codonToAA('UAA')==='Stop');
ok('translate AUGUUUUAA=Met-Phe-■', A.translate('AUGUUUUAA')==='Met-Phe-■');
ok('translate AUGUUU=Met-Phe', A.translate('AUGUUU')==='Met-Phe');
ok('codonToAA XYZ null', A.codonToAA('XYZ')===null);
ok('frames len 3', A.frames('AUGGCU').length===3);
console.log('CodonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
