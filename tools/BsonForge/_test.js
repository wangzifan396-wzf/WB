
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var doc={a:1,b:'hi',c:true,d:null,e:[1,2,3],f:{x:3.14}};
var bytes=A.bsonEnc(doc); var back=A.bsonDec(bytes);
ok('bson_a', back.a===1);
ok('bson_b', back.b==='hi');
ok('bson_c', back.c===true);
ok('bson_d', back.d===null);
ok('bson_e', Array.isArray(back.e)&&back.e[0]===1&&back.e[2]===3);
ok('bson_f', Math.abs(back.f.x-3.14)<1e-9);
ok('bson hex', typeof A.bytesToHex(bytes)==='string' && A.bytesToHex(bytes).length===bytes.length*2);
ok('bson rt equiv', JSON.stringify(back)===JSON.stringify(doc));
console.log('BsonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
