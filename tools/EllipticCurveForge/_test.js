
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('2P=(6,3)', JSON.stringify(A.mul(2,[5,1],2,17))==='[6,3]');
ok('1P=P', JSON.stringify(A.mul(1,[5,1],2,17))==='[5,1]');
ok('add inverse = null', A.add([5,1],[5,16],2,17)===null);
ok('3P = 2P+P', JSON.stringify(A.mul(3,[5,1],2,17))===JSON.stringify(A.add(A.mul(2,[5,1],2,17),[5,1],2,17)));
console.log('EllipticCurveForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
