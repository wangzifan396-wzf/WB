const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// RFC 4226 HOTP test vectors (secret = ASCII "12345678901234567890")
var sec=[]; for(var i=0;i<'12345678901234567890'.length;i++) sec.push('12345678901234567890'.charCodeAt(i));
var expected=['755224','287082','359152','969429','338314','254676','287922','162583','399871','520489'];
for(var c=0;c<10;c++) ok('HOTP RFC4226 c='+c, A.hotp(sec,c,6)===expected[c]);
// RFC 6238 TOTP SHA1 8-digit vectors
var sha1exp={'59':'94287082','1111111109':'07081804','1111111111':'14050471','1234567890':'89005924','2000000000':'69279037','20000000000':'65353130'};
Object.keys(sha1exp).forEach(function(t){
  ok('TOTP RFC6238 t='+t, A.totp(sec,{time:Number(t),period:30,digits:8})===sha1exp[t]);
});
// base32 decode sanity
ok('base32 decode JBSW', A.base32Decode('JBSW').join(',')===[72,101].join(','));
ok('asciiBytes', A.asciiBytes('AB').join(',')===[65,66].join(','));
ok('secretToBytes ascii', A.secretToBytes('AB',true).join(',')===[65,66].join(','));
// determinism + period
ok('totp deterministic', A.totp(sec,{time:1000,period:30,digits:6})===A.totp(sec,{time:1000,period:30,digits:6}));
ok('totp period boundary', A.totp(sec,{time:29,period:30,digits:6})!==A.totp(sec,{time:31,period:30,digits:6}));
console.log('TotpForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
