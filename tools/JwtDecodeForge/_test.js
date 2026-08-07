
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var h=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
var p=Buffer.from(JSON.stringify({sub:'123',name:'张三'})).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
var tok=h+'.'+p+'.sig';
var r=A.decode(tok);
ok('header alg', r.header && r.header.alg==='HS256');
ok('payload sub', r.payload && r.payload.sub==='123');
ok('payload name', r.payload && r.payload.name==='张三');
ok('signature', r.signature==='sig');
ok('bad 2 parts', A.decode('a.b').error!==undefined);
console.log('JwtDecodeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
