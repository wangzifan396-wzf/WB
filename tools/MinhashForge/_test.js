const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// shingles
ok('shingles abcd k2', JSON.stringify(Object.keys(A.mhShingles('abcd',2)).sort())===JSON.stringify(['ab','bc','cd']));
ok('shingles short input', Object.keys(A.mhShingles('a',3)).length===1);
ok('shingles normalize ws', JSON.stringify(Object.keys(A.mhShingles('a  b',3)))===JSON.stringify(['a b']));
// exact jaccard: {ab,bc,cd} vs {bc,cd,de} = 2/4
ok('jaccard half', A.mhJaccard(A.mhShingles('abcd',2), A.mhShingles('bcde',2))===0.5);
ok('jaccard identical', A.mhJaccard(A.mhShingles('xyz',2), A.mhShingles('xyz',2))===1);
ok('jaccard disjoint', A.mhJaccard(A.mhShingles('aaaa',2), A.mhShingles('bbbb',2))===0);
ok('jaccard empty', A.mhJaccard({},{})===1);
// fnv determinism + seed sensitivity
ok('fnv deterministic', A.mhFnv1a('shingle',7)===A.mhFnv1a('shingle',7));
ok('fnv seed sensitive', A.mhFnv1a('shingle',1)!==A.mhFnv1a('shingle',2));
// signature
var sig=A.mhSignature(A.mhShingles('hello world',3),64);
ok('sig length', sig.length===64);
ok('sig deterministic', JSON.stringify(sig)===JSON.stringify(A.mhSignature(A.mhShingles('hello world',3),64)));
// estimation quality
var same=A.mhCompare('minhash locality sensitive hashing','minhash locality sensitive hashing',3,128).value;
ok('identical estimate 1', same.estimate===1 && same.exact===1);
var half=A.mhCompare('abcd','bcde',2,256).value;
ok('estimate near exact', Math.abs(half.estimate-half.exact)<0.25);
var diff=A.mhCompare('completely different words entirely','javascript minified bundle output',3,128).value;
ok('different low estimate', diff.estimate<0.3);
ok('mismatched sig error', A.mhEstimate([1,2],[1]).error!==null);
console.log('MinhashForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
