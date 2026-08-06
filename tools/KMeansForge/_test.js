
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dist', Math.abs(A.kmDist([0,0],[3,4])-25)<1e-9);
var pts=[[0,0],[0.1,0.1],[0.9,0.9],[1,1]];
var lab=A.kmAssign(pts,[[0.05,0.05],[0.95,0.95]]);
ok('assign near0', lab[0]===0 && lab[1]===0);
ok('assign near1', lab[2]===1 && lab[3]===1);
var u=A.kmUpdate(pts,[0,0,1,1],2,[[0.05,0.05],[0.95,0.95]]);
ok('update mean0', Math.abs(u[0][0]-0.05)<1e-9 && Math.abs(u[0][1]-0.05)<1e-9);
ok('update mean1', Math.abs(u[1][0]-0.95)<1e-9);
// one Lloyd step must not increase inertia
var g=A.kmGenBlobs(60,3,A._rng(11),0.15);
var c0=A.kmInitCentroids(g,3,A._rng(12));
var l0=A.kmAssign(g,c0); var i0=A.kmInertia(g,l0,c0);
var c1=A.kmUpdate(g,l0,3,c0); var l1=A.kmAssign(g,c1); var i1=A.kmInertia(g,l1,c1);
ok('inertia non-increasing', i1<=i0+1e-6);
var ic=A.kmInitCentroids(g,3,A._rng(13));
ok('init distinct', ic.length===3 && (ic[0][0]!==ic[1][0]||ic[0][1]!==ic[1][1]));
console.log('KMeansForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
