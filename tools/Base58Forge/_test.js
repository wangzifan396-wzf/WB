const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function eqArr(a,b){ if(a.length!==b.length) return false; for(var i=0;i<a.length;i++) if(a[i]!==b[i]) return false; return true; }
ok('encode empty', A.b58encode([])==='');
ok('encode [0]', A.b58encode([0])==='1');
ok('encode [0,0]', A.b58encode([0,0])==='11');
ok('encode [1]', A.b58encode([1])==='2');
ok('encode [255]', A.b58encode([255])==='5Q');
ok('encode 10 zeros', A.b58encode([0,0,0,0,0,0,0,0,0,0])==='1111111111');
ok('decode empty', eqArr(A.b58decode(''),[]));
ok('decode 1', eqArr(A.b58decode('1'),[0]));
ok('decode 11', eqArr(A.b58decode('11'),[0,0]));
ok('decode 2', eqArr(A.b58decode('2'),[1]));
ok('decode 5Q', eqArr(A.b58decode('5Q'),[255]));
ok('roundtrip bytes', eqArr(A.b58decode(A.b58encode([1,2,3,255,0,16])),[1,2,3,255,0,16]));
ok('roundtrip bytes2', eqArr(A.b58decode(A.b58encode([0,0,1,255,254,253])),[0,0,1,255,254,253]));
ok('roundtrip str', A.b58decodeStr(A.b58encodeStr('Hello World'))==='Hello World');
ok('roundtrip str2', A.b58decodeStr(A.b58encodeStr('nano-tools 2026'))==='nano-tools 2026');
var threw=false; try{ A.b58decode('0'); }catch(e){ threw=true; }
ok('invalid char throws', threw);
ok('decode leading ones', eqArr(A.b58decode('111'),[0,0,0]));
console.log('Base58Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
