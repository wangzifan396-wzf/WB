
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('(1+2x+3x²)(1+x) = [1,3,5,3]', JSON.stringify(A.mul([1,2,3],[1,1]))==='[1,3,5,3]');
ok('add [1,2]+[3,4,5] = [4,6,5]', JSON.stringify(A.add([1,2],[3,4,5]))==='[4,6,5]');
ok('eval 1+2x+3x² at 2 =17', A.eval([1,2,3],2)===17);
ok('eval at 0 = const', A.eval([5,9,1],0)===5);
console.log('PolynomialForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
