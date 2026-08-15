
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dec',A.ipToDecimal('192.168.1.1')===3232235777);
ok('hex',A.ipToHex('192.168.1.1')==='C0A80101');
ok('back',A.decimalToIp(3232235777)==='192.168.1.1');
ok('hex2ip',A.hexToIp('C0A80101')==='192.168.1.1');
ok('hex0x',A.hexToIp('0xC0A80101')==='192.168.1.1');
ok('err',A.ipToDecimal('999.1.1.1')===null);
ok('bound',A.ipToDecimal('255.255.255.255')===4294967295);
console.log('HexIpForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
