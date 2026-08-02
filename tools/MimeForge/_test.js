const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('json -> application/json', A.lookup('json')==='application/json');
ok('.json -> application/json', A.lookup('.json')==='application/json');
ok('JSON upper', A.lookup('JSON')==='application/json');
ok('png', A.lookup('png')==='image/png');
ok('unknown null', A.lookup('zzz')===null);
ok('reverse json', (A.reverse('application/json')||[]).indexOf('json')>=0);
ok('reverse html', (A.reverse('text/html')||[]).indexOf('html')>=0);
ok('reverse multi', (A.reverse('application/javascript')||[]).indexOf('js')>=0);
ok('reverse unknown', A.reverse('x/y')===null);
ok('normExt', A.normExt('.PNG')==='png');
console.log('MimeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
