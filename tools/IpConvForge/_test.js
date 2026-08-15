
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var o=A.parseIp('192.168.1.1');ok('parse',o&&o.join(',')==='192,168,1,1');
ok('decimal',A.toDecimal([192,168,1,1])===3232235777);
ok('fromDecimal',A.intToIp(3232235777).join(',')==='192,168,1,1');
ok('binary',A.toBinary([255,255,255,0])==='11111111.11111111.11111111.00000000');
ok('hex',A.toHex([192,168,1,1])==='C0A80101');
ok('classify',A.classify([10,0,0,1]).scope.indexOf('私网')>=0);
ok('invalid',A.parseIp('999.1.1.1')===null);
var c=A.convert('8.8.8.8');ok('convert',c&&c.class==='A'&&c.scope==='公网');
console.log('IpConvForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
