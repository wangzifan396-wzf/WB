
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var a=P.msCreate(9,9,10,42), b=P.msCreate(9,9,10,42);
var mc=0; for(var i=0;i<a.grid.length;i++) mc+=a.grid[i];
ok(mc===10,'mine count exact');
ok(JSON.stringify(a.grid)===JSON.stringify(b.grid),'deterministic by seed');
ok(a.revealed.every(function(v){return v===0;}),'nothing revealed at start');
// reveal a known safe cell (first non-mine)
var sx=-1,sy=-1; for(var y=0;y<9&&sx<0;y++) for(var x=0;x<9;x++){ if(a.grid[y*9+x]===0){ sx=x;sy=y;break; } }
var r1=P.msReveal(a,sx,sy);
ok(r1.hit===false,'safe reveal not hit');
ok(r1.revealed[sy*9+sx]===1,'safe cell revealed');
ok(r1.revealed.reduce(function(s,v){return s+v;},0)>=1,'at least one revealed');
// reveal a mine -> hit
var mx=-1,my=-1; for(var y=0;y<9;y++) for(var x=0;x<9;x++){ if(a.grid[y*9+x]===1){ mx=x;my=y;break; } }
var r2=P.msReveal(a,mx,my);
ok(r2.hit===true,'mine reveal sets hit');
// flag toggle
var f1=P.msToggleFlag(a,sx,sy);
ok(f1.flags[sy*9+sx]===1,'flag set');
var f2=P.msToggleFlag(f1,sx,sy);
ok(f2.flags[sy*9+sx]===0,'flag cleared');
// win: reveal all safe
var st=a;
for(var y=0;y<9;y++) for(var x=0;x<9;x++){ if(st.grid[y*9+x]===0) st=P.msReveal(st,x,y); }
ok(P.msWin(st)===true,'win after revealing all safe');
ok(P.msWin(a)===false,'not won at start');
console.log('PASS '+n+' assertions');
