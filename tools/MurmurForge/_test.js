const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// Wikipedia reference vectors for MurmurHash3 x86_32
ok('empty seed 0', A.murmurStr('',0)===0);
ok('empty seed 1', A.murmurStr('',1)===0x514E28B7);
ok('empty seed ffffffff', A.murmurStr('',0xffffffff)===0x81F16F39);
ok('test seed 0', A.murmurStr('test',0)===0xba6bd213);
ok('test seed 9747b28c', A.murmurStr('test',0x9747b28c)===0x704b81dc);
ok('hello world', A.murmurStr('Hello, world!',0)===0xc0363e43);
ok('fox', A.murmurStr('The quick brown fox jumps over the lazy dog',0)===0x2e4ff723);
ok('deterministic', A.murmurStr('abc',42)===A.murmurStr('abc',42));
ok('seed sensitive', A.murmurStr('abc',1)!==A.murmurStr('abc',2));
ok('input sensitive', A.murmurStr('abc',0)!==A.murmurStr('abd',0));
ok('hex pad 8', A.murmurHex('',0)==='00000000');
ok('utf8 bytes', JSON.stringify(A.mmToUtf8('\u4e2d'))===JSON.stringify([0xe4,0xb8,0xad]));
var u=A.murmurStr('\u4e2d\u6587',7); ok('utf8 hash range', u>=0 && u<=0xffffffff && u===Math.floor(u));
var b=A.murmurBucket('key',0,10); ok('bucket in range', b.error===null && b.value>=0 && b.value<10);
ok('bucket zero error', A.murmurBucket('key',0,0).error!==null);
console.log('MurmurForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
