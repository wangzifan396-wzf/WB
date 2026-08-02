const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('encodeTime spec', A.encodeTime(1469918176385,10)==='01ARYZ6S41');
ok('encodeRandom zero', A.encodeRandom(16,function(){return 0;})==='0000000000000000');
var g=A.generate(1469918176385, function(){return 0;});
ok('generate time part', g.slice(0,10)==='01ARYZ6S41');
ok('generate len', g.length===26);
ok('isValid true', A.isValid('01ARYZ6S410000000000000000'));
ok('isValid false len', A.isValid('01ARYZ6S41')===false);
ok('isValid false char', A.isValid('I1ARYZ6S410000000000000000')===false);
var d=A.decode('01ARYZ6S410000000000000000');
ok('decode time', d.time===1469918176385);
ok('decode date 2016', d.date && d.date.indexOf('2016')===0);
ok('decode rand hex', d.randomness==='00000000000000000000');
ok('roundtrip encodetime', A.encodeTime(A.decode(g).time,10)===g.slice(0,10));
ok('decode bad len', A.decode('short').error!==undefined);
console.log('ULIDForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
