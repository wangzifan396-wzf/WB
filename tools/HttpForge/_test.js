const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('lookup 404', A.lookupStatus(404).text==='Not Found');
ok('lookup 200 cat', A.lookupStatus(200).category==='2xx 成功');
ok('lookup 500 cat', A.lookupStatus(500).category==='5xx 服务端错误');
ok('lookup unknown', A.lookupStatus(999)===null);
ok('category 3xx', A.statusCategory(301)==='3xx 重定向');
ok('search by code', A.searchStatus('404').length===1 && A.searchStatus('404')[0].code===404);
ok('search by text', A.searchStatus('not found').some(function(s){return s.code===404;}));
ok('search empty all', A.searchStatus('').length>=40);
ok('search sorted', (function(){var r=A.searchStatus('');return r[0].code<=r[1].code;})());
ok('methods GET safe', A.METHODS.filter(function(m){return m.name==='GET';})[0].safe===true);
ok('methods POST not idempotent', A.METHODS.filter(function(m){return m.name==='POST';})[0].idempotent===false);
ok('methods PUT idempotent', A.METHODS.filter(function(m){return m.name==='PUT';})[0].idempotent===true);
ok('mime json', A.lookupMime('json')==='application/json');
ok('mime dot strip', A.lookupMime('.svg')==='image/svg+xml');
ok('mime unknown', A.lookupMime('xyz')===null);
ok('searchMime', A.searchMime('image').length>=5);
console.log('HttpForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
