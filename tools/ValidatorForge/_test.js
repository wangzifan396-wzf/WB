
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('email-ok', A.isEmail('user@example.com')===true);
ok('email-bad', A.isEmail('bad@')===false);
ok('ipv4-ok', A.isIpv4('192.168.0.1')===true);
ok('ipv4-bad', A.isIpv4('999.1.1.1')===false);
ok('ipv6-ok', A.isIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')===true);
ok('mac-ok', A.isMac('00:1B:44:11:3A:B7')===true);
ok('url-ok', A.isUrl('https://example.com')===true);
ok('validate', A.validate('email','a@b.co').ok===true);
console.log('ValidatorForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
