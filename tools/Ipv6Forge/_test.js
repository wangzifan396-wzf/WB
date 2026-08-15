
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('expand1',A.expand('::1')==='0000:0000:0000:0000:0000:0000:0000:0001');
ok('expand2',A.expand('2001:db8::1')==='2001:0db8:0000:0000:0000:0000:0000:0001');
ok('compress1',A.compress('2001:0db8:0000:0000:0000:0000:0000:0001')==='2001:db8::1');
ok('compress2',A.compress('fe80:0:0:0:0:0:0:1')==='fe80::1');
ok('invalid',A.expand('gggg::')===null);
ok('loopback',A.classify('::1').type==='loopback');
ok('linklocal',A.classify('fe80::1').type==='link-local');
ok('multicast',A.classify('ff02::1').type==='multicast');
ok('ula',A.classify('fc00::1').type==='unique-local');
ok('mapped',A.classify('::ffff:192.0.2.1').type==='ipv4-mapped');
ok('global',A.classify('2001:db8::1').type==='global');
console.log('Ipv6Forge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
