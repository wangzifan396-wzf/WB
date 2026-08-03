
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('aries', A.signOf('1990-04-20')==='白羊座');
ok('cap', A.signOf('1990-01-10')==='摩羯座');
ok('leo', A.signOf('1990-08-01')==='狮子座');
ok('invalid', A.signOf('not-a-date')===null);
ok('horo type', typeof A.horoscope('白羊座')==='string');
console.log('HoroscopeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
