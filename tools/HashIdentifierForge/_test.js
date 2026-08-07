
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('md5', A.identify('5d41402abc4b2a76b9719d911017c592').types.indexOf('MD5')>=0);
ok('sha256', A.identify('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855').types.indexOf('SHA-256')>=0);
ok('sha512', A.identify('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e').types.indexOf('SHA-512')>=0);
ok('bcrypt', A.identify('$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZd9qJ6jFm').types.indexOf('bcrypt')>=0);
ok('argon2', A.identify('$argon2id$v=19$m=65536,t=2,p=1$abc').types.indexOf('argon2')>=0);
ok('sha1', A.identify('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d').types.indexOf('SHA-1')>=0);
console.log('HashIdentifierForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
