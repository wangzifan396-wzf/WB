
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.hexToRgb('#ff0000');
ok('ff0000 -> 255,0,0', c.r===255 && c.g===0 && c.b===0);
ok('rgbToHex roundtrip', A.rgbToHex(255,0,0)==='#ff0000');
ok('short hex #0f0', A.hexToRgb('#0f0').g===255);
ok('invalid null', A.hexToRgb('xyz')===null);
console.log('ColorPickerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
