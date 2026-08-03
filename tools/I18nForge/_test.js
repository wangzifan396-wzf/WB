
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('camel', A.toKey('User Name','camel')==='userName');
ok('pascal', A.toKey('User Name','pascal')==='UserName');
ok('snake', A.toKey('user name','snake')==='user_name');
ok('kebab', A.toKey('user name','kebab')==='user-name');
ok('dot', A.toKey('User Name','dot')==='user.name');
ok('constant', A.toKey('User Name','constant')==='USER_NAME');
ok('ns', A.toKey('User Name','snake','app.api')==='app_api_user_name');
ok('bulk dedup', A.bulk('a b\nA B','snake','',true).length===1);
console.log('I18nForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
