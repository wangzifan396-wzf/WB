
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('valid', A.validate('00:1B:44:11:3A:B7')===true);
ok('valid2', A.validate('aabbccddeeff')===true);
ok('invalid', A.validate('zzzz')===false);
ok('norm', A.normalize('00-1B-44')==='001b44');
ok('fmt', A.format('aabbccddeeff',':')==='aa:bb:cc:dd:ee:ff');
ok('fmtDash', A.format('aabbccddeeff','-')==='aa-bb-cc-dd-ee-ff');
ok('gen', /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/.test(A.generate(rngFactory(1))));
console.log('MacAddrForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
