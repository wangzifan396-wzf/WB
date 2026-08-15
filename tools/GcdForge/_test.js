
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gcd',A.gcd(12,18)===6);
ok('lcm',A.lcm(4,6)===12);
ok('gcdMany',A.gcdMany([12,18,24])===6);
ok('lcmMany',A.lcmMany([4,6,8])===24);
ok('fact',A.factorize(360).map(function(p){return p[0];}).join(',')==='2,3,5');
ok('prime',A.factorize(17).length===1 && A.factorize(17)[0][0]===17);
ok('coprime',A.isCoprime(8,15)===true);
ok('notcoprime',A.isCoprime(8,12)===false);
console.log('GcdForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
