
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('norm', A.normHex('#FFF')==='#ffffff');
ok('bw', A.contrastRatio(A.hexToRgb('#000000'),A.hexToRgb('#ffffff'))>=20.9);
var au=A.auditPalette('#000000\n#ffffff');
ok('pairs', au.total===1 && au.aaCount===1);
var du=A.auditPalette('#5E6AD2\n#0A0A0B\n#5E6AD2');
ok('dedupe', du.colors.length===2 && du.total===1);
ok('err', !!A.auditPalette('#fff').error);
ok('level', A.levelFor(2.1)==='Fail' && A.levelFor(5)==='AA');
console.log('ColorPaletteAuditForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
