const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('valid simple', A.validate('user@example.com').valid===true);
ok('invalid missing @', A.validate('userexample.com').valid===false);
ok('invalid domain no dot', A.validate('user@localhost').valid===false);
ok('invalid local space', A.validate('user name@example.com').valid===false);
ok('invalid double dot domain', A.validate('user@ex..com').valid===false);
var p=A.parse('user+promo@example.com');
ok('parse tagged', p.isTagged===true && p.tag==='promo');
ok('parse baseLocal', A.parse('user+promo@example.com').baseLocal==='user');
ok('role role-based', A.role('admin@example.com').role===true && A.role('admin@example.com').type==='role');
ok('role personal', A.role('john@example.com').role===false);
ok('invalid tld short', A.validate('user@ex.c').valid===false);
ok('invalid too long', A.validate('a'.repeat(260)+'@x.com').valid===false);
ok('valid complex', A.validate('john.doe99+test@sub.example.co.uk').valid===true);
console.log('MailForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
