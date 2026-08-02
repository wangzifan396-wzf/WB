const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('aws key detected', A.scan('x AKIAIOSFODNN7EXAMPLE y').some(function(r){return r.rule==='AWS Access Key';}));
ok('github token detected', A.scan('ghp_1234567890abcdefABCDEF1234567890ab').length>=1);
ok('jwt detected', A.scan('Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijklmnopqrstuvwxyzABCDEF').some(function(r){return r.rule==='JWT';}));
ok('clean text none', A.scan('just some normal code here').length===0);
ok('entropy zero', A.entropy('aaaa')===0);
ok('entropy 2', Math.abs(A.entropy('abcd')-2)<1e-9);
ok('entropy high', A.entropy('aZ9kQ2mPxB7vL1nR4tY8wS3cD5fG6hJ0')>3.8);
ok('high-entropy flagged', A.scan('key = "aZ9kQ2mPxB7vL1nR4tY8wS3cD5fG6hJ0"').some(function(r){return r.rule==='High-Entropy';}));
ok('rules count', A.RULES.length===9);
ok('index reported', A.scan('AB AKIAIOSFODNN7EXAMPLE')[0].index===3);
ok('private key detected', A.scan('-----BEGIN RSA PRIVATE KEY-----').some(function(r){return r.rule==='Private Key';}));
ok('password assign detected', A.scan('password = "supersecret123"').some(function(r){return r.rule==='Password Assign';}));
console.log('SecretForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
