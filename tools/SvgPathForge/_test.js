
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.pathToAbsolute('M10 10 h5')==='M10 10 H15', 'h->H');
ok(P.pathToAbsolute('M0 0 l5 5')==='M0 0 L5 5', 'l->L');
var b=P.pathBBox('M0 0 L10 0 L10 5 Z');
ok(b.minX===0 && b.minY===0 && b.maxX===10 && b.maxY===5 && b.width===10 && b.height===5, 'bbox');
ok(P.pathSimplify('M1.23456 2.34567',1)==='M1.2 2.3', 'simplify');
ok(P.pathParse('M1 2 L3 4').length===2, 'parse count');
console.log('SvgPathForge _test: '+n+' passed, 0 failed');
