const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('freq aab', JSON.stringify(A.huffFreq('aab'))==='{"a":2,"b":1}');
var enc=A.huffEncode('abracadabra');
ok('codes has a,b', enc.codes.hasOwnProperty('a') && enc.codes.hasOwnProperty('b'));
ok('prefix-free', !(enc.codes.a.indexOf(enc.codes.b)===0 || enc.codes.b.indexOf(enc.codes.a)===0));
ok('roundtrip abracadabra', A.huffDecode(enc.bits, enc.codes)==='abracadabra');
ok('empty bits', A.huffEncode('').bits==='');
ok('single char 0000', A.huffEncode('aaaa').bits==='0000');
ok('single code 0', A.huffCodes(A.huffBuild(A.huffFreq('aaaa')))['a']==='0');
ok('bits only 0/1', /^[01]*$/.test(enc.bits));
ok('deterministic', A.huffEncode('abc').bits===A.huffEncode('abc').bits);
ok('decode trailing', A.huffDecode('000', {a:'0'})==='aaa');
ok('enc len aaaa=4', A.huffEncode('aaaa').bits.length===4);
ok('skewed compresses', A.huffEncode('aaaaaaaaaa').bits.length < 80);
ok('distinct symbols', Object.keys(A.huffEncode('abcabc').codes).length===3);
console.log('HuffmanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
