const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var s1='TOBEORNOTTOBEORTOBEORNOT';
ok('roundtrip TOBE', A.lzwDecompress(A.lzwCompress(s1))===s1);
var s2='hello hello hello world world';
ok('roundtrip hello', A.lzwDecompress(A.lzwCompress(s2))===s2);
ok('roundtrip empty', A.lzwDecompress(A.lzwCompress(''))==='');
var s3='the quick brown fox jumps over the lazy dog';
ok('roundtrip fox', A.lzwDecompress(A.lzwCompress(s3))===s3);
var s4='aaaaaaaaaaaaaaaaaaaa';
ok('roundtrip a*20', A.lzwDecompress(A.lzwCompress(s4))===s4);
var c=A.lzwCompress('AAAAAA');
ok('aaa codes', c[0]===65 && c[1]===256);
ok('aaa decompress', A.lzwDecompress([65,256])==='AAA');
ok('compress shrinks repetitive', A.lzwCompress(s4).length < s4.length);
ok('max code > 255', Math.max.apply(null, A.lzwCompress(s4)) > 255);
ok('codes are numbers', A.lzwCompress('ab').every(function(x){return typeof x==='number';}));
var threw=false; try{ A.lzwDecompress([999]); }catch(e){ threw=true; }
ok('bad code throws', threw);
ok('roundtrip cafe', A.lzwDecompress(A.lzwCompress('cafe\u00e9'))==='cafe\u00e9');
console.log('LzwForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
