const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('single leaf root = leafHash', A.merkleRoot(['a'])===A.leafHash('a'));
ok('two leaves', A.merkleRoot(['a','b'])===A.nodeHash(A.leafHash('a'),A.leafHash('b')));
ok('deterministic', A.merkleRoot(['a','b','c'])===A.merkleRoot(['a','b','c']));
ok('order matters', A.merkleRoot(['a','b'])!==A.merkleRoot(['b','a']));
ok('odd duplicates last', A.merkleRoot(['a','b','c'])===A.nodeHash(A.nodeHash(A.leafHash('a'),A.leafHash('b')),A.nodeHash(A.leafHash('c'),A.leafHash('c'))));
var lv=A.merkleLevels(['a','b','c','d']);
ok('levels shape', lv.length===3 && lv[0].length===4 && lv[1].length===2 && lv[2].length===1);
var leaves=['a','b','c','d','e'];
var root=A.merkleRoot(leaves);
for(var i=0;i<leaves.length;i++){
  if(!A.merkleVerify(leaves[i], A.merkleProof(leaves,i), root)){ ok('verify all leaves', false); break; }
  if(i===leaves.length-1) ok('verify all leaves', true);
}
ok('tampered leaf fails', !A.merkleVerify('X', A.merkleProof(leaves,2), root));
ok('wrong root fails', !A.merkleVerify('c', A.merkleProof(leaves,2), A.merkleRoot(['x','y'])));
ok('proof length log2', A.merkleProof(['a','b','c','d'],0).length===2);
var t=false; try{ A.merkleRoot([]); }catch(e){ t=(e.message==='EMPTY'); }
ok('empty throws', t);
var t2=false; try{ A.merkleProof(['a'],5); }catch(e){ t2=(e.message==='INDEX_RANGE'); }
ok('index range throws', t2);
console.log('MerkleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
