const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('shq plain', A.shq('abc')==='abc');
ok('shq space', A.shq('a b')==="'a b'");
ok('shq single quote', A.shq("a'b")==="'a'\\''b'");
ok('parseHeaders one', A.parseHeaders('A: b')[0].key==='A' && A.parseHeaders('A: b')[0].value==='b');
ok('parseHeaders multi', A.parseHeaders('A: b\nC: d').length===2);
ok('parseHeaders empty', A.parseHeaders('').length===0);
ok('parseHeaders invalid throws', (function(){ try{ A.parseHeaders('nope'); return false; }catch(e){ return true; } })());
const c1=A.buildCurl({url:'https://x.com/a'});
ok('GET no -X', c1.indexOf('-X')<0);
ok('GET has url', c1.indexOf('https://x.com/a')>=0);
const c2=A.buildCurl({url:'https://x.com',method:'POST',bodyType:'json',body:'{"a":1}'});
ok('POST has -X', c2.indexOf('-X POST')>=0);
ok('json auto content-type', c2.indexOf('Content-Type: application/json')>=0);
ok('json body quoted', c2.indexOf('-d')>=0 && c2.indexOf('{"a":1}')>=0);
const c3=A.buildCurl({url:'https://x.com',bodyType:'form',method:'POST',body:'a=1&b=2'});
ok('form content-type', c3.indexOf('application/x-www-form-urlencoded')>=0);
ok('user auth', A.buildCurl({url:'https://x.com',user:'u:p'}).indexOf('-u u:p')>=0);
ok('flags', (function(){ var c=A.buildCurl({url:'https://x.com',silent:true,includeHeaders:true,followRedirect:true,insecure:true}); return c.indexOf('-s')>=0&&c.indexOf('-i')>=0&&c.indexOf('-L')>=0&&c.indexOf('-k')>=0; })());
ok('empty url throws', (function(){ try{ A.buildCurl({url:''}); return false; }catch(e){ return true; } })());
ok('no dup content-type', (function(){ var c=A.buildCurl({url:'https://x.com',method:'POST',bodyType:'json',body:'{}',headers:[{key:'Content-Type',value:'application/json'}]}); return c.split('Content-Type').length===2; })());
console.log('CurlForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
