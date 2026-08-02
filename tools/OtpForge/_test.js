
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return OtpForgePure();')();
const assert=require('assert');
const seed=[]; for(var i=0;i<'12345678901234567890'.length;i++) seed.push('12345678901234567890'.charCodeAt(i));
// RFC 6238 向量（8 位，SHA1）
assert.strictEqual(P.hotp(seed, Math.floor(59/30), 8), '94287082', 'T=59');
assert.strictEqual(P.totp(seed, 1111111109, 8, 30), '07081804', 'T=1111111109');
assert.strictEqual(P.totp(seed, 1234567890, 8, 30), '89005924', 'T=1234567890');
assert.strictEqual(P.totp(seed, 2000000000, 8, 30), '69279037', 'T=2000000000');
// Base32 往返
const rt=P.b32decode(P.b32encode(seed));
assert.deepStrictEqual(rt, seed, 'base32 roundtrip');
// otpauth 解析
const o=P.parseOtpauth('otpauth://totp/ACME:alice?secret=JBSWY3DPEHPK3PXP&issuer=ACME&digits=6&period=30');
assert.strictEqual(o.type,'totp');
assert.strictEqual(o.secret,'JBSWY3DPEHPK3PXP');
assert.strictEqual(o.digits,6);
assert.strictEqual(o.period,30);
// analyze 结构（基于当前时间，仅校验形态）
const r=P.analyze(P.b32encode(seed), {digits:8, period:30});
assert.ok(!r.error, 'analyze no error');
assert.strictEqual(r.type,'totp');
assert.strictEqual(r.current.code.length, 8, 'current code len');
assert.strictEqual(r.window.length, 3, 'window size');
assert.ok(r.remaining>=1 && r.remaining<=30, 'remaining in range');
console.log('PASS otp 8/0');
