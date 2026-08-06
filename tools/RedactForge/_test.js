
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mask keep', A.rdMask('abcdef',2,1)==='ab■■■f');
ok('email mask', (function(){var r=A.rdEmail('alice@example.com',1); return r[0]==='a' && r.indexOf('@example.com')>0;})());
ok('card mask', (function(){var r=A.rdRedact('4111 1111 1111 1111').replace(/\s/g,''); return r.slice(-4)==='1111' && r.indexOf('■')>=0;})());
ok('ip mask', A.rdRedact('10.0.0.5')==='10.0.0.■');
console.log('RedactForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
