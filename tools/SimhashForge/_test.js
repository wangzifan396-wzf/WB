const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// popcount
ok('popcount 0', A.shPopcount32(0)===0);
ok('popcount f', A.shPopcount32(0xf)===4);
ok('popcount all', A.shPopcount32(0xffffffff)===32);
// hamming
ok('hamming zero', A.shHamming('0000000000000000','0000000000000000').value===0);
ok('hamming f', A.shHamming('0000000000000000','000000000000000f').value===4);
ok('hamming full', A.shHamming('0000000000000000','ffffffffffffffff').value===64);
ok('hamming symmetric', A.shHamming('abcdef0123456789','9876543210fedcba').value===A.shHamming('9876543210fedcba','abcdef0123456789').value);
ok('hamming bad input', A.shHamming('xyz','0000000000000000').error!==null);
// simhash basics
var h=A.simhash64('hello world hello simhash').value;
ok('hex 16 chars', /^[0-9a-f]{16}$/.test(h));
ok('deterministic', A.simhash64('hello world hello simhash').value===h);
ok('empty text zero', A.simhash64('').value==='0000000000000000');
ok('identical distance 0', A.shCompare('same text here','same text here',3).value.hamming===0);
// near-duplicate property: single-word edit closer than unrelated text
var base='the quick brown fox jumps over the lazy dog and keeps running through the field';
var tweak='the quick brown fox jumped over the lazy dog and keeps running through the field';
var other='completely unrelated database schema migration tutorial with docker containers';
var dNear=A.shCompare(base,tweak,3).value.hamming;
var dFar=A.shCompare(base,other,3).value.hamming;
ok('near closer than far', dNear<dFar);
ok('far is distant', dFar>10);
ok('features word+bigram', A.shFeatures('a b')['a']===1 && A.shFeatures('a b')['a b']===1);
console.log('SimhashForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
