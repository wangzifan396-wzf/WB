
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('RFC AB=BB8', A.b45EncStr('AB')==='BB8');
ok('RFC Hello', A.b45EncStr('Hello!!')==='%69 VD92EX0');
ok('roundtrip', A.b45DecStr(A.b45EncStr('Test message 123'))==='Test message 123');
console.log('Base45Forge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
