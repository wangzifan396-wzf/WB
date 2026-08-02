
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.hashIsHex('5d41402abc4b2a76b9719d911017c592')===true,'hex detect');
ok(P.hashIsHex('5g')===false,'non hex');
ok(P.hashIsB64('aGVsbG8=')===true,'b64 detect');
ok(P.hashIsB64('abc')===false,'b64 len mismatch');
const a=P.hashIdentify('5d41402abc4b2a76b9719d911017c592');
ok(a.error===null && P.hashIdentify('5d41402abc4b2a76b9719d911017c592').candidates.some(function(c){return c.type==='MD5';}),'md5');
const b=P.hashIdentify('$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
ok(b.candidates.some(function(c){return c.type==='bcrypt';}),'bcrypt');
const c=P.hashIdentify('$argon2i$v=19$m=4096,t=3,p=1$c29tZXNhbHQ$');
ok(c.candidates.some(function(c){return c.type==='Argon2';}),'argon2');
const d=P.hashIdentify('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
ok(d.candidates.some(function(c){return c.type==='SHA-256';}),'sha256');
const e=P.hashIdentify('*6C8989366EAF75BB1E56EACA597BB117ECAC45A9');
ok(e.candidates.some(function(c){return c.type==='MySQL PASSWORD';}),'mysql');
const f=P.hashIdentify('not a hash !!');
ok(f.candidates.length>=1 && f.candidates[0].type==='未知格式','unknown format');
ok(P.hashIdentify('').error!==null,'empty error');
console.log('PASS '+n+' assertions');
