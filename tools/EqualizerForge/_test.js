
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('db0', Math.abs(A.dbToGain(0)-1)<1e-9);
ok('db6', Math.abs(A.dbToGain(6)-1.9953)<1e-3);
ok('db-6', Math.abs(A.dbToGain(-6)-0.5012)<1e-3);
ok('preset len', A.presetBands('Rock').length===10);
ok('preset flat', A.presetBands('Flat').every(function(x){return x===0;}));
console.log('EqualizerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
