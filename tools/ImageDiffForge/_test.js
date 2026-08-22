
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=new Uint8Array([10,10,10,255, 10,10,10,255, 10,10,10,255, 10,10,10,255]);
var b=new Uint8Array([10,10,10,255, 110,10,10,255, 10,10,10,255, 10,10,10,255]);
var r=A.diffPixels(a,b,2,2,{threshold:10});
ok('diff', r.diffCount===1 && r.total===4 && r.ratioPct===25 && r.maxDelta===100 && r.avgDelta===100 && r.identical===false);
ok('bbox', r.bbox && r.bbox.minX===1 && r.bbox.minY===0 && r.bbox.maxX===1 && r.bbox.maxY===0 && r.rowCounts[0]===1 && r.rowCounts[1]===0);
ok('mask', r.mask.length===4 && r.mask[1]===1 && r.mask[0]===0 && r.mask[3]===0);
ok('cls', A.classifyDiff(r).level==='major' && A.classifyDiff(r).label==='显著差异');
var r2=A.diffPixels(a,b,2,2,{threshold:200});
ok('thresh', r2.identical===true && r2.diffCount===0 && r2.bbox===null && A.classifyDiff(r2).label==='完全一致');
var c=new Uint8Array([10,10,10,254, 10,10,10,255, 10,10,10,255, 10,10,10,255]);
ok('alpha', A.diffPixels(a,c,2,2,{}).identical===true);
ok('lenerr', !!A.diffPixels(a,new Uint8Array(8),2,2,{}).error);
ok('dimerr', !!A.diffPixels(a,b,3,3,{}).error);
ok('minor', A.classifyDiff({identical:false,ratioPct:0.5}).level==='minor' && A.classifyDiff({identical:false,ratioPct:5}).level==='visible');
console.log('ImageDiffForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
