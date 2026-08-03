
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('affine enc known', A.affineEnc('HELLO',5,8)==='RCLLA');
ok('affine dec known', A.affineDec('RCLLA',5,8)==='HELLO');
ok('affine rt', A.affineDec(A.affineEnc('AFFINECIPHER',5,8),5,8)==='AFFINECIPHER');
ok('gcd coprime', A.gcd(5,26)===1);
ok('gcd not', A.gcd(2,26)!==1);
ok('modinv', A.modinv(5,26)===21);
ok('affine invalid a throws', (function(){try{A.affineEnc('X',2,1);return false;}catch(e){return true;}})());
console.log('AffineForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
