const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('getStatus 200', A.getStatus(200).name==='OK');
ok('catOf 404', A.catOf(404)==='客户端错误');
ok('search by code prefix', (function(){var r=A.searchStatus('40'); return r.length>0 && r.every(function(s){return String(s.code).indexOf('40')===0;});})());
ok('search by keyword', A.searchStatus('not found').some(function(s){return s.code===404;}));
ok('listByCat 5xx', A.listByCat('服务器错误').every(function(s){return s.code>=500;}));
ok('all numeric', A.searchStatus('').every(function(s){return typeof s.code==='number';}));
console.log('StatusForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
