const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('empty seed0', A.xxhash32('',0)===0x02CC5D05);
ok('empty seed1', A.xxhash32('',1)===0x0B2CB792);
ok('a seed0', A.xxhash32('a',0)===0x550D7456);
ok('abc seed0', A.xxhash32('abc',0)===0x32D153FF);
ok('long ascii', A.xxhash32('Nobody inspects the spammish repetition',0)===0xE2293B2F);
ok('hex format', A.xxhash32Hex('abc',0)==='32d153ff');
ok('hex padded 8', A.xxhash32Hex('',0).length===8);
ok('deterministic', A.xxhash32('hello',42)===A.xxhash32('hello',42));
ok('seed changes hash', A.xxhash32('hello',0)!==A.xxhash32('hello',1));
ok('input changes hash', A.xxhash32('hello',0)!==A.xxhash32('hellp',0));
ok('bytes api', A.xxhash32Bytes([97,98,99],0)===0x32D153FF);
ok('utf8 stable', A.xxhash32('\u4f60\u597d',0)===A.xxhash32('\u4f60\u597d',0));
var long=new Array(1000).join('x');
ok('long input uint32', A.xxhash32(long,0)>=0 && A.xxhash32(long,0)<=4294967295);
ok('15 bytes small path', typeof A.xxhash32('123456789012345',0)==='number');
ok('16 bytes stripe path', typeof A.xxhash32('1234567890123456',0)==='number');
console.log('XxhashForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
