
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var leaves=['a','b','c','d'];
var r=A.build(leaves).root;
ok('root 64 hex', /^[0-9a-f]{64}$/.test(r));
var pr=A.proof(leaves,0);
ok('proof non-empty', pr.length>=1);
ok('verify idx0 true', A.verify(leaves,0,pr,r)===true);
ok('verify idx2 true', A.verify(leaves,2,A.proof(leaves,2),r)===true);
ok('verify tampered false', A.verify(['x','b','c','d'],0,pr,r)===false);
console.log('MerkleTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
