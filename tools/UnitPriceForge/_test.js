
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('unitPrice(5,2)=2.5', Math.abs(A.unitPrice(5,2)-2.5)<1e-9);
ok('bestValue A better', A.bestValue([{price:5,qty:2},{price:3,qty:1}])===0);
ok('bestValue B better', A.bestValue([{price:5,qty:2},{price:9,qty:5}])===1);
ok('savings positive', A.savings([{price:5,qty:2},{price:3,qty:1}])>0);
ok('unitPrice qty 0 = NaN', isNaN(A.unitPrice(5,0)));
console.log('UnitPriceForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
