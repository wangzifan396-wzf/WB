
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('new zero', A.lightsSolved(A.lightsNew(5))===true);
ok('center 5', (function(){var b=A.lightsToggle(A.lightsNew(5),2,2,5); var n=0; b.forEach(function(x){if(x)n++;}); return n===5;})());
ok('toggle twice', (function(){var b=A.lightsNew(5); var b1=A.lightsToggle(b,2,2,5); var b2=A.lightsToggle(b1,2,2,5); return A.lightsSolved(b2);})());
ok('scramble len', A.lightsScramble(5).length===25);
console.log('LightsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
