
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.parseSetCookie('sid=abc123; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600; Domain=example.com');
ok('parse', p.name==='sid' && p.value==='abc123' && p.attrs.path==='/' && p.attrs.secure===true && p.attrs.httpOnly===true && p.attrs.sameSite==='Lax' && p.attrs.maxAgeSec===3600 && p.attrs.domain==='example.com' && p.valid===true && p.issues.length===0);
var p2=A.parseSetCookie('x=1; SameSite=None');
ok('samesite-none', p2.valid===false && p2.issues[0].indexOf('Secure')>=0);
var p3=A.parseSetCookie('x=1; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
ok('expired-warn', p3.warnings.some(function(w){return w.indexOf('过期')>=0;}) && p3.attrs.expiresTs===0);
var p4=A.parseSetCookie('x=1; Max-Age=abc; Path=api');
ok('bad-attrs', p4.issues.length>=2 && p4.attrs.maxAgeSec===null && p4.valid===false);
var ps=A.parseCookiePairs('a=1; b=2');
ok('pairs', ps.length===2 && ps[0].name==='a' && ps[0].value==='1' && ps[1].name==='b' && ps[1].value==='2');
ok('pairs2', A.parseCookiePairs('flag')[0].name==='flag' && A.parseCookiePairs('flag')[0].value==='');
var b=A.buildSetCookie({name:'theme',value:'dark',days:1,path:'/',secure:true,httpOnly:true,sameSite:'Lax'});
ok('build', b.header.indexOf('theme=dark')===0 && b.header.indexOf('Expires=')>=0 && b.header.indexOf('Max-Age=86400')>=0 && b.header.indexOf('Path=/')>=0 && b.header.indexOf('HttpOnly')>=0 && b.header.indexOf('Secure')>=0 && b.header.indexOf('SameSite=Lax')>=0 && b.issues.length===0);
ok('build2', A.buildSetCookie({name:'a',value:'b',sameSite:'None'}).issues.length===1 && !!A.buildSetCookie({}).error);
ok('domain', A.domainMatch('api.example.com','example.com')===true && A.domainMatch('example.com','example.com')===true && A.domainMatch('api.example.com','.example.com')===true && A.domainMatch('badexample.com','example.com')===false && A.domainMatch('a.com','')===false);
ok('path', A.pathMatch('/a/b','/a')===true && A.pathMatch('/a','/')===true && A.pathMatch('/x','/a')===false && A.pathMatch('/ab','/a')===false);
var cr=A.cookieReport('sid=1; Path=/; Secure','api.example.com','/v1/x',true);
ok('report-ok', cr.sendable===true);
var cr2=A.cookieReport('sid=1; Path=/; Secure','api.example.com','/v1/x',false);
ok('report-secure', cr2.sendable===false && cr2.reasons[0].indexOf('Secure')>=0);
var cr3=A.cookieReport('sid=1; Domain=example.com','other.org','/',true);
ok('report-domain', cr3.sendable===false && cr3.reasons.join(' ').indexOf('Domain')>=0);
var cr4=A.cookieReport('sid=1; Expires=Thu, 01 Jan 1970 00:00:00 GMT','a.com','/',true);
ok('report-expired', cr4.sendable===false && cr4.reasons.join(' ').indexOf('过期')>=0);
ok('report-path', A.cookieReport('sid=1; Path=/admin','a.com','/home',true).sendable===false);
console.log('CookieForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
