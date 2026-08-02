const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b){ return Math.abs(a-b)<1e-9; }
ok('cosine identical', near(A.cosineSim([1,2,3],[1,2,3]),1));
ok('cosine orthogonal', near(A.cosineSim([1,0],[0,1]),0));
ok('cosine opposite', near(A.cosineSim([1,2],[-1,-2]),-1));
ok('euclidean 3-4-5', near(A.euclidean([0,0],[3,4]),5));
ok('manhattan', near(A.manhattan([1,2],[4,6]),7));
ok('dot', near(A.dot([1,2,3],[4,5,6]),32));
ok('parseVec ok', JSON.stringify(A.parseVec('1, 2  3').value)==='[1,2,3]');
ok('parseVec bad', A.parseVec('1,x,3').error!==null);
ok('parseVec empty', A.parseVec('  ').error!==null);
var t=false; try{ A.cosineSim([0,0],[1,1]); }catch(e){ t=(e.message==='ZERO_VECTOR'); }
ok('zero vector throws', t);
var t2=false; try{ A.euclidean([1],[1,2]); }catch(e){ t2=(e.message==='DIM_MISMATCH'); }
ok('dim mismatch throws', t2);
var docs=[{id:'a',vec:[1,0]},{id:'b',vec:[0.9,0.1]},{id:'c',vec:[0,1]}];
var r=A.topK([1,0],docs,2,'cosine');
ok('topK order+limit', r.length===2 && r[0].id==='a' && r[1].id==='b');
console.log('VectorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
