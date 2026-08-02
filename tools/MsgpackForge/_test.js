const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function rt(v){ return A.mpDecode(A.mpEncode(v)); }
ok('nil', A.mpToHex(A.mpEncode(null))==='c0');
ok('true', A.mpToHex(A.mpEncode(true))==='c3');
ok('false', A.mpToHex(A.mpEncode(false))==='c2');
ok('fixint 7', A.mpToHex(A.mpEncode(7))==='07');
ok('negative fixint', A.mpToHex(A.mpEncode(-1))==='ff');
ok('uint8 200', A.mpToHex(A.mpEncode(200))==='ccc8');
ok('fixstr', A.mpToHex(A.mpEncode('abc'))==='a3616263');
ok('fixarray', A.mpToHex(A.mpEncode([1,2]))==='920102');
ok('fixmap', A.mpToHex(A.mpEncode({a:1}))==='81a16101');
ok('rt int', rt(12345)===12345);
ok('rt negative', rt(-30000)===-30000);
ok('rt float', rt(3.14)===3.14);
ok('rt utf8', rt('你好 msgpack')==='你好 msgpack');
var obj={name:'nano',stars:128,tags:['tiny','fast'],ok:true,rate:0.5,none:null};
ok('rt nested', JSON.stringify(rt(obj))===JSON.stringify(obj));
var long=[]; for(var i=0;i<300;i++) long.push(i%100);
ok('rt array16', JSON.stringify(rt(long))===JSON.stringify(long));
var threw=false; try{ A.mpDecode([0xda,0x00]); }catch(e){ threw=true; }
ok('truncated throws', threw);
var threw2=false; try{ A.mpFromHex('zz'); }catch(e){ threw2=true; }
ok('bad hex throws', threw2);
console.log('MsgpackForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
