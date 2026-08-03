
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('b91 alphabet len', A.b91enc ? (function(){return true;})() : false);
var s=[72,101,108,108,111]; // "Hello"
var enc=A.b91enc(s); var dec=A.b91dec(enc);
ok('b91 rt', dec.join(',')===s.join(','));
var big=[]; for(var i=0;i<200;i++) big.push(i%256);
ok('b91 big rt', A.b91dec(A.b91enc(big)).join(',')===big.join(','));
ok('b91 no invalid chars', (function(){var e=A.b91enc([1,2,3,4,5,6,7,8,9,10]);for(var i=0;i<e.length;i++)if(A.b91dec(e[i])===undefined)return false;return true;})());
ok('b91 empty', A.b91enc([])==='' && A.b91dec('').length===0);
console.log('Base91Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
