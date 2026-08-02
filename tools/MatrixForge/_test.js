const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function eq2(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
ok('add', eq2(A.matAdd([[1,2],[3,4]],[[5,6],[7,8]]),[[6,8],[10,12]]));
ok('mul', eq2(A.matMul([[1,2,3],[4,5,6]],[[7,8],[9,10],[11,12]]),[[58,64],[139,154]]));
ok('transpose', eq2(A.matTrans([[1,2,3],[4,5,6]]),[[1,4],[2,5],[3,6]]));
var I=[[1,0],[0,1]]; ok('mul identity', eq2(A.matMul([[1,2],[3,4]],I),[[1,2],[3,4]]));
ok('det 2x2', A.matDet([[1,2],[3,4]])===-2);
ok('det 3x3 identity', A.matDet([[1,0,0],[0,1,0],[0,0,1]])===1);
ok('det diagonal', A.matDet([[2,0,0],[0,3,0],[0,0,4]])===24);
ok('inv 2x2', Math.abs(A.matInv([[4,7],[2,6]])[0][0]-0.6)<1e-9);
var invB=A.matInv([[4,7],[2,6]]); ok('inv[0][1]', Math.abs(invB[0][1]+0.7)<1e-9);
var M=[[6,1,1],[4,-2,5],[2,8,7]]; var prod=A.matMul(M,A.matInv(M));
ok('A*inv≈I', Math.abs(prod[0][0]-1)<1e-9 && Math.abs(prod[1][1]-1)<1e-9 && Math.abs(prod[2][2]-1)<1e-9);
var threw=false; try{ A.matMul([[1,2]],[[1]]); }catch(e){ threw=true; }
ok('dim mismatch throws', threw);
ok('zero add', eq2(A.matAdd([[0,0]],[[0,0]]),[[0,0]]));
var threw2=false; try{ A.matInv([[1,2],[2,4]]); }catch(e){ threw2=true; }
ok('singular throws', threw2);
console.log('MatrixForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
