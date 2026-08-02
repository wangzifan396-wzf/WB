
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return OauthForgePure();')();
const assert=require('assert');

// ---- SHA-256 官方测试向量 ----
assert.strictEqual(P.sha256Hex(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
assert.strictEqual(P.sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
assert.strictEqual(P.sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'),
  '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1', '多分组消息');
// 长消息触发多轮压缩
assert.strictEqual(P.sha256Hex(new Array(1000001).join('a')),
  'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0', '一百万个 a');

// ---- base64url ----
assert.strictEqual(P.b64urlEncode([0]), 'AA');
assert.strictEqual(P.b64urlEncode(P.utf8Bytes('hello')), 'aGVsbG8');
assert.strictEqual(P.b64urlEncode([251, 255]), '-_8', 'URL 安全字符表');
assert.deepStrictEqual(P.b64urlDecode('aGVsbG8').value, P.utf8Bytes('hello'));
assert.ok(P.b64urlDecode('aGVs+G8').error, '标准 Base64 要被拒绝');
assert.ok(P.b64urlDecode('aGVsbG8=').error, '不允许填充');
assert.ok(P.b64urlDecode('aa$bb').error, '非法字符');
// UTF-8 往返
['中文', 'a', 'emoji 🚀 tail', ''].forEach(function(s){
  assert.strictEqual(P.bytesUtf8(P.utf8Bytes(s)), s, 'utf8 roundtrip ' + s);
});

// ---- PKCE：RFC 7636 附录 B 的官方向量 ----
var V = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
var C = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';
assert.strictEqual(P.challengeOf(V, 'S256').value, C, 'RFC 7636 官方 code_challenge');
assert.strictEqual(P.verifyPkce(V, C, 'S256').value, true);
assert.strictEqual(P.verifyPkce(V + 'x', C, 'S256').value, false, '改一个字符就不该通过');
assert.strictEqual(P.challengeOf(V, 'plain').value, V);
assert.ok(P.challengeOf(V, 'plain').warning, 'plain 要给警告');
assert.ok(P.challengeOf(V, 'S1').error, '未知方法');
// 长度与字符集
assert.ok(P.checkVerifier('short').error, '短于 43 字符');
assert.ok(P.checkVerifier(new Array(131).join('a')).error, '长于 128 字符');
assert.ok(P.checkVerifier(new Array(44).join('a') + '+').error, '含非法字符');
assert.strictEqual(P.checkVerifier(V).length, 43);
assert.ok(P.checkVerifier(V).entropyBits > 200, '43 字符约 260 比特, got ' + P.checkVerifier(V).entropyBits);

// ---- URL 解析 ----
var u = P.parseUrl('https://a.example.com/authorize?a=1&b=hello%20world&c');
assert.strictEqual(u.value.scheme, 'https');
assert.strictEqual(u.value.host, 'a.example.com');
assert.strictEqual(u.value.path, '/authorize');
assert.strictEqual(u.value.params.b, 'hello world', '百分号解码');
assert.strictEqual(u.value.params.c, '', '无值参数');
assert.deepStrictEqual(P.parseUrl('https://x/y?a=1&a=2').value.duplicates, ['a'], '检出重复参数');
assert.ok(P.parseUrl('not a url').error);
assert.ok(P.parseUrl('').error);

// ---- 回调地址 ----
assert.strictEqual(P.checkRedirect('https://app.example.com/cb').ok, true);
assert.strictEqual(P.checkRedirect('http://localhost:8080/cb').ok, true, '环回允许明文');
assert.strictEqual(P.checkRedirect('http://127.0.0.1/cb').ok, true);
assert.strictEqual(P.checkRedirect('http://app.example.com/cb').ok, false, '非环回明文回调必须拒绝');
assert.strictEqual(P.checkRedirect('https://*.example.com/cb').ok, false, '通配符必须拒绝');
assert.strictEqual(P.checkRedirect('https://app.example.com/cb#frag').ok, false, '不允许片段');
assert.ok(P.checkRedirect('').error, '空回调');
// 环回写死端口只给警告
var lb = P.checkRedirect('http://localhost:8080/cb');
assert.ok(lb.issues.some(function(i){ return i.level === 'warn'; }), '写死端口应告警');
assert.strictEqual(lb.value.loopback, true);
// 私有 scheme 走原生分支
assert.strictEqual(P.checkRedirect('com.example.app:/oauth').value.scheme, 'custom');

// ---- 授权请求体检：合规样例 ----
var goodUrl = 'https://auth.example.com/authorize?response_type=code&client_id=web-app' +
  '&redirect_uri=https://app.example.com/cb&scope=openid%20profile&state=Xk7Qp2Lm9RtV' +
  '&code_challenge=' + C + '&code_challenge_method=S256&nonce=n-0S6';
var A = P.auditAuthorize(goodUrl);
assert.strictEqual(A.errors, 0, '合规样例不应有硬错误：' + JSON.stringify(A.issues.filter(function(i){return i.level==='error';})));
assert.strictEqual(A.warnings, 0, '合规样例不应有告警：' + JSON.stringify(A.issues.filter(function(i){return i.level==='warn';})));
assert.strictEqual(A.grade, '合格');
assert.deepStrictEqual(A.value.scopes, ['openid', 'profile']);

// ---- 隐式流必须被判死刑 ----
var imp = P.auditAuthorize('https://auth.example.com/authorize?response_type=token&client_id=x&redirect_uri=https://a.b/cb');
assert.ok(imp.errors > 0);
assert.ok(imp.issues.some(function(i){ return /隐式流/.test(i.msg); }), '要点名隐式流');
assert.strictEqual(imp.grade, '不合格');

// ---- 缺 PKCE ----
var np = P.auditAuthorize('https://auth.example.com/authorize?response_type=code&client_id=x&redirect_uri=https://a.b/cb&state=abcdefgh');
assert.ok(np.issues.some(function(i){ return i.level === 'error' && /code_challenge/.test(i.msg); }));

// ---- 既无 state 又无 PKCE 是硬错误 ----
var bare = P.auditAuthorize('https://auth.example.com/authorize?response_type=code&client_id=x&redirect_uri=https://a.b/cb');
assert.ok(bare.issues.some(function(i){ return i.level === 'error' && /CSRF|跨站/.test(i.msg); }));

// ---- 明文端点 ----
assert.ok(P.auditAuthorize('http://auth.example.com/authorize?response_type=code&client_id=x').issues
  .some(function(i){ return i.level === 'error' && /https/.test(i.msg); }));

// ---- plain 方法在请求里出现是硬错误 ----
assert.ok(P.auditAuthorize(goodUrl.replace('S256', 'plain')).issues
  .some(function(i){ return i.level === 'error' && /S256/.test(i.msg); }));

// ---- 过宽 scope 与缺 nonce ----
assert.ok(P.auditAuthorize(goodUrl.replace('openid%20profile', 'admin')).issues
  .some(function(i){ return /最小权限/.test(i.msg); }));
assert.ok(P.auditAuthorize(goodUrl.replace('&nonce=n-0S6', '')).issues
  .some(function(i){ return /nonce/.test(i.msg); }));

// ---- 重复参数 ----
assert.ok(P.auditAuthorize(goodUrl + '&client_id=other').issues
  .some(function(i){ return i.level === 'error' && /重复/.test(i.msg); }));

// ---- 令牌响应 ----
var tr = P.auditTokenResponse({access_token:'x', token_type:'Bearer', expires_in:600});
assert.strictEqual(tr.ok, true);
assert.strictEqual(tr.warnings, 0);
assert.strictEqual(P.auditTokenResponse({token_type:'Bearer'}).ok, false, '缺 access_token');
assert.strictEqual(P.auditTokenResponse({access_token:'x'}).ok, false, '缺 token_type');
assert.ok(P.auditTokenResponse({access_token:'x', token_type:'Bearer', expires_in:-1}).errors > 0);
assert.ok(P.auditTokenResponse({access_token:'x', token_type:'Bearer', expires_in:99999}).warnings > 0, '有效期过长告警');
assert.ok(P.auditTokenResponse({access_token:'x', token_type:'Bearer', expires_in:600, refresh_token:'r'}).warnings > 0,
  '刷新令牌未声明有效期应告警');

// ---- JWT 声明浏览 ----
function jwt(header, payload){
  return P.b64urlEncode(P.utf8Bytes(JSON.stringify(header))) + '.' +
         P.b64urlEncode(P.utf8Bytes(JSON.stringify(payload))) + '.sig';
}
var now = 1700000000;
var okTok = jwt({alg:'RS256', typ:'JWT'}, {iss:'https://auth', aud:'api', iat:now - 60, exp:now + 600, sub:'u1'});
var d = P.decodeJwt(okTok, now);
assert.strictEqual(d.ok, true, JSON.stringify(d.issues));
assert.strictEqual(d.value.payload.sub, 'u1');
assert.strictEqual(d.value.ttl, 660);
assert.strictEqual(d.value.signaturePresent, true);
// alg=none 攻击
assert.ok(P.decodeJwt(jwt({alg:'none'}, {exp:now + 10}), now).issues
  .some(function(i){ return i.level === 'error' && /none/.test(i.msg); }));
// 过期
assert.ok(P.decodeJwt(jwt({alg:'RS256'}, {exp:now - 10}), now).issues
  .some(function(i){ return i.level === 'error' && /过期/.test(i.msg); }));
// 未生效
assert.ok(P.decodeJwt(jwt({alg:'RS256'}, {exp:now + 100, nbf:now + 50}), now).issues
  .some(function(i){ return i.level === 'error' && /尚未生效/.test(i.msg); }));
// 缺 exp / aud / iss 只告警
var lax = P.decodeJwt(jwt({alg:'RS256'}, {sub:'u'}), now);
assert.strictEqual(lax.ok, true);
assert.ok(lax.issues.length >= 3, '缺 exp、aud、iss 三条告警');
// 段数与格式
assert.ok(P.decodeJwt('a.b', now).error, '段数不对');
assert.ok(P.decodeJwt('a.b.c.d.e', now).error, 'JWE 不解析');
assert.ok(P.decodeJwt('!!!.' + P.b64urlEncode(P.utf8Bytes('{}')) + '.s', now).error, '头部非法');
assert.ok(P.decodeJwt(P.b64urlEncode(P.utf8Bytes('nope')) + '.' + P.b64urlEncode(P.utf8Bytes('{}')) + '.s', now).error,
  '头部不是 JSON');
// 中文声明能正确还原
var cn = P.decodeJwt(jwt({alg:'HS256'}, {name:'张三', exp:now + 10}), now);
assert.strictEqual(cn.value.payload.name, '张三', 'UTF-8 声明还原');

// ---- 流程选型 ----
assert.strictEqual(P.recommend('spa').value.flow, '授权码 + PKCE');
assert.strictEqual(P.recommend('spa').value.secret, false);
assert.strictEqual(P.recommend('machine').value.flow, '客户端凭据');
assert.strictEqual(P.FLOWS.length, 5);
assert.ok(P.recommend('nope').error);

// ---- 汇总入口 ----
var Z = P.analyze(goodUrl);
assert.strictEqual(Z.ok, true);
assert.strictEqual(Z.value.pkcePresent, true);
assert.strictEqual(Z.grade, '合格');
assert.ok(P.analyze('garbage').error);

console.log('PASS oauth 8/0');
