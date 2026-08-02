const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('b64 roundtrip', A.b64urlDecode(A.b64urlEncode('{"alg":"none"}'))==='{"alg":"none"}');
ok('b64 special chars', A.b64urlDecode(A.b64urlEncode('a+b/c=d'))==='a+b/c=d');
function buildToken(header, payload, sig){
  return A.b64urlEncode(JSON.stringify(header))+'.'+A.b64urlEncode(JSON.stringify(payload))+'.'+(sig||'sig');
}
var tNone = buildToken({alg:'none',typ:'JWT'}, {sub:'1', name:'Ada'});
var an = A.analyze(tNone);
ok('analyze valid', an.valid===true);
ok('alg none flag', an.algNone===true);
var tHs = buildToken({alg:'HS256',typ:'JWT'}, {sub:'1', name:'Ada'});
ok('alg hs not none', A.analyze(tHs).algNone===false);
var now = Math.floor(Date.now()/1000);
var tExp = buildToken({alg:'HS256'}, {sub:'1', exp: now-100});
ok('expired past', A.analyze(tExp).expired===true);
ok('not expired future', A.analyze(buildToken({alg:'HS256'}, {exp: now+1000})).expired===false);
ok('decode invalid parts', A.decode('a.b').error!==undefined);
ok('decode empty', A.decode('').error!==undefined);
var dec = A.decode(tHs);
ok('decode header', dec.header.alg==='HS256');
ok('decode payload', dec.payload.sub==='1');
ok('humanize exp string', typeof A.humanize({exp:1516239022})._exp_human==='string' && A.humanize({exp:1516239022})._exp_human.indexOf('-')>=0);
console.log('JwtForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
