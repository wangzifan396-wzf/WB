const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var sk=A.cmsCreate(64,4);
A.cmsAdd(sk,'apple',10);
ok('exact single count', A.cmsCount(sk,'apple')===10);
A.cmsAdd(sk,'banana',3);
ok('apple still 10', A.cmsCount(sk,'apple')===10);
ok('banana >=3', A.cmsCount(sk,'banana')>=3);
ok('missing >=0', A.cmsCount(sk,'zzz')>=0);
A.cmsAdd(sk,'apple',5);
ok('increment', A.cmsCount(sk,'apple')===15);
// merge (element-wise max of cells)
var a=A.cmsCreate(64,4), b=A.cmsCreate(64,4);
A.cmsAdd(a,'x',7); A.cmsAdd(b,'x',3); A.cmsMerge(a,b);
ok('merge takes max', A.cmsCount(a,'x')===7);
var c=A.cmsCreate(64,4), d=A.cmsCreate(64,4);
A.cmsAdd(c,'y',2); A.cmsAdd(d,'y',9); A.cmsMerge(c,d);
ok('merge larger wins', A.cmsCount(c,'y')===9);
var pa=A.cmsCreate(32,4), pb=A.cmsCreate(64,4);
var threw=false; try{ A.cmsMerge(pa,pb); }catch(e){ threw=(e.message==='CMS_SHAPE_MISMATCH'); }
ok('merge shape mismatch throws', threw);
ok('fnv deterministic', A.fnv1a32('k')===A.fnv1a32('k'));
ok('count never negative', A.cmsCount(A.cmsCreate(8,2),'q')>=0);
ok('add returns sketch', A.cmsAdd(A.cmsCreate(16,3),'z')!==null);
ok('width respected', (function(){var s=A.cmsCreate(64,4);A.cmsAdd(s,'w');var idx=A.cmsHash(s,'w',0);return idx>=0&&idx<64;})());
console.log('SketchForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
