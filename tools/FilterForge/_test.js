
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('grayOf(255,0,0)=76', A.grayOf(255,0,0)===76);
ok('grayOf(0,255,0)=150', A.grayOf(0,255,0)===150);
var g=A.applyFilter(new Uint8ClampedArray([255,0,0,255]),'grayscale'); ok('grayscale R0=76', g[0]===76 && g[1]===76 && g[2]===76 && g[3]===255);
var inv=A.applyFilter(new Uint8ClampedArray([10,20,30,255]),'invert'); ok('invert', inv[0]===245 && inv[1]===235 && inv[2]===225);
var br=A.applyFilter(new Uint8ClampedArray([10,20,30,255]),'brightness',{delta:10}); ok('brightness+10', br[0]===20 && br[1]===30 && br[2]===40);
var th=A.applyFilter(new Uint8ClampedArray([255,0,0,255]),'threshold'); ok('threshold low gray=0', th[0]===0 && th[1]===0 && th[2]===0);
var se=A.applyFilter(new Uint8ClampedArray([255,255,255,255]),'sepia'); ok('sepia white', se[0]===255 && se[1]===255 && se[2]===239);
console.log('FilterForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
