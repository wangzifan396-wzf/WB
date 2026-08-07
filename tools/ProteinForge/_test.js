
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('translateProtein AUGUUUUAA=MF', A.translateProtein('AUGUUUUAA')==='MF');
ok('translateProtein AUGGCA=MA', A.translateProtein('AUGGCA')==='MA');
ok('translateProtein stops at *', A.translateProtein('AUGUUUUAG')==='MF');
ok('framesProtein len 3', A.framesProtein('AUGGCU').length===3);
ok('translateProtein ATG (T→U)', A.translateProtein('ATG')==='M');
console.log('ProteinForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
