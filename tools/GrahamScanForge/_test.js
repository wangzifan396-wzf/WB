
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var pts=[[0,0],[1,0],[1,1],[0,1],[0.5,0.5]];
var h=A.hull(pts);
ok('hull 4 corners', h.length===4);
ok('contains (1,1)', h.some(function(p){return p[0]===1&&p[1]===1;}));
ok('contains (0,0)', h.some(function(p){return p[0]===0&&p[1]===0;}));
ok('excludes interior', !h.some(function(p){return p[0]===0.5&&p[1]===0.5;}));
console.log('GrahamScanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
