'use strict';
var fs=require('fs'), path=require('path');
var html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
var m=/<script>([\s\S]*?)<\/script>/.exec(html);
if(!m) throw new Error('index.html 里找不到内核 script');
var mod={exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
var P=mod.exports;

/* ===== 以下向量逐字取自 RFC 7515 附录 A，并经 Node crypto 独立核验 ===== */
var PL = 'eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ';
// --- A.1 HS256 ---
var A1_HDR = 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9';
var A1_SIG = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
var A1_JWS = A1_HDR + '.' + PL + '.' + A1_SIG;
var A1_KEY = {kty:'oct', k:'AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow'};
// --- A.2 RS256（2048 位 RSA） ---
var A2_HDR = 'eyJhbGciOiJSUzI1NiJ9';
var A2_SIG = 'cC4hiUPoj9Eetdgtv3hF80EGrhuB__dzERat0XF9g2VtQgr9PJbu3XOiZj5RZmh7AAuHIm4Bh-0Qc_lF5YKt_O8W2Fp5jujGbds9uJdbF9CUAr7t1dnZcAcQjbKBYNX4BAynRFdiuB--f_nZLgrnbyTyWzO75vRK5h6xBArLIARNPvkSjtQBMHlb1L07Qe7K0GarZRmB_eSN9383LcOLn6_dO--xi12jzDwusC-eOkHWEsqtFZESc6BfI7noOPqvhJ1phCnvWh6IeYI2w9QOYEUipUTI8np6LbgGY9Fs98rqVt5AXLIhWkWywlVmtVrBp0igcN_IoypGlUPQGe77Rw';
var A2_JWS = A2_HDR + '.' + PL + '.' + A2_SIG;
var A2_N = 'ofgWCuLjybRlzo0tZWJjNiuSfb4p4fAkd_wWJcyQoTbji9k0l8W26mPddxHmfHQp-Vaw-4qPCJrcS2mJPMEzP1Pt0Bm4d4QlL-yRT-SFd2lZS-pCgNMsD1W_YpRPEwOWvG6b32690r2jZ47soMZo9wGzjb_7OMg0LOL-bSf63kpaSHSXndS5z5rexMdbBYUsLA9e-KXBdQOS-UTo7WTBEMa2R2CapHg665xsmtdVMTBQY4uDZlxvb3qCo5ZwKh9kG4LT6_I5IhlJH7aGhyxXFvUK-DWNmoudF8NAco9_h9iaGNj8q2ethFkMLs91kzk2PAcDTW9gb54h4FRWyuXpoQ';
var A2_D = 'Eq5xpGnNCivDflJsRQBXHx1hdR1k6Ulwe2JZD50LpXyWPEAeP88vLNO97IjlA7_GQ5sLKMgvfTeXZx9SE-7YwVol2NXOoAJe46sui395IW_GO-pWJ1O0BkTGoVEn2bKVRUCgu-GjBVaYLU6f3l9kJfFNS3E0QbVdxzubSu3Mkqzjkn439X0M_V51gfpRLI9JYanrC4D4qAdGcopV_0ZHHzQlBjudU2QvXt4ehNYTCBr6XCLQUShb1juUO1ZdiYoFaFQT5Tw8bGUl_x_jTj3ccPDVZFD9pIuhLhBOneufuBiB4cS98l2SR_RQyGWSeWjnczT0QU91p1DhOVRuOopznQ';
var A2_PUB = {kty:'RSA', n:A2_N, e:'AQAB'};
var A2_PRIV = {kty:'RSA', n:A2_N, e:'AQAB', d:A2_D};
// --- A.3 ES256（P-256 / SHA-256） ---
var A3_HDR = 'eyJhbGciOiJFUzI1NiJ9';
var A3_SIG = 'DtEhU3ljbEg8L38VWAfUAqOyKAM6-Xx-F4GawxaepmXFCgfTjDxw5djxLa8ISlSApmWQxfKTUJqPP3-Kg6NU1Q';
var A3_JWS = A3_HDR + '.' + PL + '.' + A3_SIG;
var A3_PUB = {kty:'EC', crv:'P-256',
  x:'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
  y:'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0'};
var A3_PRIV = {kty:'EC', crv:'P-256', x:A3_PUB.x, y:A3_PUB.y,
  d:'jpsQnnGQmL-YBIffH1136cspYG6-0iY7X1fCE9-E9LI'};
// --- A.4 ES512（P-521 / SHA-512，载荷是 ASCII "Payload"） ---
var A4_HDR = 'eyJhbGciOiJFUzUxMiJ9';
var A4_PL  = 'UGF5bG9hZA';
var A4_SIG = 'AdwMgeerwtHoh-l192l60hp9wAHZFVJbLfD_UxMi70cwnZOYaRI1bKPWROc-mZZqwqT2SI-KGDKB34XO0aw_7XdtAG8GaSwFKdCAPZgoXD2YBJZCPEX3xKpRwcdOO8KpEHwJjyqOgzDO7iKvU8vcnwNrmxYbSW9ERBXukOXolLzeO_Jn';
var A4_JWS = A4_HDR + '.' + A4_PL + '.' + A4_SIG;
var A4_PUB = {kty:'EC', crv:'P-521',
  x:'AekpBQ8ST8a8VcfVOTNl353vSrDCLLJXmPk06wTjxrrjcBpXp5EOnYG_NjFZ6OvLFV1jSfS9tsz4qUxcWceqwQGk',
  y:'ADSmRA43Z1DSNx_RvcLI87cdL07l6jQyyBXMoxVg_l2Th-x3S1WDhjDly79ajL4Kkd0AZMaZmh9ubmf63e3kyMj2'};
var A4_PRIV = {kty:'EC', crv:'P-521', x:A4_PUB.x, y:A4_PUB.y,
  d:'AY5pb7A0UFiB3RELSD64fTLOSV_jazdF7fLYyuTw8lOfRhWg6Y6rUrPAxerEzgdRhajnu0ferB0d53vM9mE15j2C'};

var pass=0, fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ if(a===b){pass++;} else {fail++; console.error('FAIL: '+msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')');} }
function seq(n,v){ var a=[]; for(var i=0;i<n;i++) a.push(v===undefined?(i&0xff):v); return a; }
function hexOf(bytes){ return P.toHex(bytes); }

// ============ 1. PRIM 新增 SHA-384/512 已知向量 ============
eq(hexOf(P.sha384Bytes(P.utf8Bytes('abc'))),
   'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
   'SHA-384("abc") 已知向量');
eq(hexOf(P.sha512Bytes(P.utf8Bytes('abc'))),
   'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
   'SHA-512("abc") 已知向量');
eq(hexOf(P.sha512Bytes([])),
   'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
   'SHA-512("") 空串向量（覆盖长度字段大端编码）');
// 跨 128 字节分组边界：112 字节恰好触发补一整块
eq(hexOf(P.sha512Bytes(P.utf8Bytes(new Array(113).join('a')))).length, 128,
   'SHA-512 跨块输入产出 64 字节摘要');
eq(hexOf(P.hmacSha512(P.utf8Bytes('key'), P.utf8Bytes('The quick brown fox jumps over the lazy dog'))),
   'b42af09057bac1e2d41708e48a902e09b5ff7f12ab428a4fe86653c73dd248fb82f948a549f7b791a5b41915ee4d1ec3935357e4e2317250d0372afa2ebeeb3a',
   'HMAC-SHA512 已知向量（RFC 标准例）');

// ============ 2. 椭圆曲线自洽性（参数与运算正确性的硬证据） ============
function onCurve(c, pt){
  if(!pt) return true;
  var p=c.p, lhs=(pt.y*pt.y)%p, rhs=((pt.x*pt.x%p)*pt.x + c.a*pt.x + c.b)%p;
  return ((lhs%p)+p)%p === ((rhs%p)+p)%p;
}
['P-256','P-384','P-521'].forEach(function(name){
  var c=P.EC[name];
  ok(onCurve(c,{x:c.gx,y:c.gy}), name+' 生成元 G 在曲线上');
  eq(P.ecMul(c.n, {x:c.gx,y:c.gy}, c), null, name+' 生成元阶正确 (n·G = ∞)');
  eq(c.a, (c.p-3n+c.p)%c.p, name+' 曲线参数 a = p-3');
  var G={x:c.gx,y:c.gy};
  ok(onCurve(c, P.ecMul(2n,G,c)), name+' 2G 仍在曲线上');
  eq(P.ecMul(3n,G,c).x, P.ecAdd(P.ecMul(2n,G,c), G, c).x, name+' 3G = 2G+G（倍点与加法自洽）');
});

// ============ 3. RFC 7515 A.1 —— HS256 外部向量 ============
var r1=P.verifyJws(A1_JWS, A1_KEY);
eq(r1.verdict,'VALID','RFC7515 A.1 HS256 验签通过');
eq(r1.format,'compact','RFC7515 A.1 是紧凑序列化');
eq(r1.results[0].alg,'HS256','RFC7515 A.1 alg=HS256');
ok(/"iss":"joe"/.test(r1.payloadText),'RFC7515 A.1 载荷解码出 iss=joe');
// 签名字节可被复现（与 RFC 记载逐字节一致）
eq(P.b64url(P.hmacByName('sha256', P.b64urlDecode(A1_KEY.k), P.utf8Bytes(A1_HDR+'.'+PL))),
   A1_SIG, 'RFC7515 A.1 HMAC 输出与 RFC 记载签名逐字节一致');
var r1b=P.verifyJws(A1_HDR+'.'+PL.replace('eyJpc3MiOiJqb2Ui','eyJpc3MiOiJqb0Ui')+'.'+A1_SIG, A1_KEY);
eq(r1b.verdict,'INVALID','RFC7515 A.1 篡改载荷后验签失败');
var r1c=P.verifyJws(A1_JWS, {kty:'oct', k:P.b64url(seq(64,0x00))});
eq(r1c.verdict,'INVALID','RFC7515 A.1 换错密钥后验签失败');

// ============ 4. RFC 7515 A.2 —— RS256 外部向量（2048 位 RSA） ============
var r2=P.verifyJws(A2_JWS, A2_PUB);
eq(r2.verdict,'VALID','RFC7515 A.2 RS256 验签通过（2048 位外部公钥）');
eq(r2.results[0].alg,'RS256','RFC7515 A.2 alg=RS256');
var r2b=P.verifyJws(A2_HDR+'.'+PL+'.'+A2_SIG.replace('cC4hiUPo','cC4hiUPp'), A2_PUB);
eq(r2b.verdict,'INVALID','RFC7515 A.2 篡改签名后验签失败');
// PKCS#1 v1.5 是确定性的：用向量私钥重签应逐字节复现整个 JWS
var reSigned=P.signJws({alg:'RS256'}, P.b64uStr(PL), A2_PRIV);
ok(!reSigned.error, 'RFC7515 A.2 用向量私钥签发成功');
eq(reSigned.jws, A2_JWS, 'RFC7515 A.2 重签结果与 RFC 记载 JWS 逐字节一致');

// ============ 5. RFC 7515 A.3 —— ES256 外部向量（P-256 / SHA-256） ============
var r3=P.verifyJws(A3_JWS, A3_PUB);
eq(r3.verdict,'VALID','RFC7515 A.3 ES256 验签通过（外部公钥向量）');
eq(r3.results[0].alg,'ES256','RFC7515 A.3 alg=ES256');
var r3b=P.verifyJws(A3_HDR+'.'+PL+'.'+A3_SIG.replace('DtEhU3ljbEg8','DtEhU3ljbEg9'), A3_PUB);
eq(r3b.verdict,'INVALID','RFC7515 A.3 篡改签名后验签失败');
// 用向量私钥自签（RFC6979 的 k 与 RFC 示例不同，故只校验可验证性）
var s3=P.signJws({alg:'ES256'}, P.b64uStr(PL), A3_PRIV);
ok(!s3.error, 'RFC7515 A.3 私钥可用于签发');
eq(P.verifyJws(s3.jws, A3_PUB).verdict, 'VALID', 'A.3 私钥自签可被向量公钥验证通过');

// ============ 6. RFC 7515 A.4 —— ES512 外部向量（P-521 / SHA-512） ============
var r4=P.verifyJws(A4_JWS, A4_PUB);
eq(r4.verdict,'VALID','RFC7515 A.4 ES512 验签通过（P-521 + SHA-512）');
eq(r4.results[0].alg,'ES512','RFC7515 A.4 alg=ES512');
eq(r4.payloadText,'Payload','RFC7515 A.4 载荷是 ASCII "Payload"');
eq(P.b64urlDecode(A4_SIG).length, 132, 'RFC7515 A.4 签名长度 = 2×66 字节（P-521 域元素）');
var r4b=P.verifyJws(A4_HDR+'.'+A4_PL+'.'+A4_SIG.replace('AdwMgeer','AdwMgees'), A4_PUB);
eq(r4b.verdict,'INVALID','RFC7515 A.4 篡改签名后验签失败');
var s4=P.signJws({alg:'ES512'}, 'Payload', A4_PRIV);
ok(!s4.error, 'RFC7515 A.4 私钥可用于签发');
eq(P.verifyJws(s4.jws, A4_PUB).verdict, 'VALID', 'A.4 私钥自签可被向量公钥验证通过');

// ============ 7. ES384（P-384）自签自验 + RFC6979 确定性 ============
var c384=P.EC['P-384'];
var d384=0x3b4f9c8e2d1a7b6f5e4d3c2b1a09f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7n;
var Q384=P.ecMul(d384, {x:c384.gx,y:c384.gy}, c384);
ok(Q384!==null,'P-384 私钥对应公钥非无穷远点');
ok(onCurve(c384,Q384),'P-384 推导出的公钥在曲线上');
var ec384Priv={kty:'EC', crv:'P-384', d:P.b64url(P.bnToBytes(d384,48)),
               x:P.b64url(P.bnToBytes(Q384.x,48)), y:P.b64url(P.bnToBytes(Q384.y,48))};
var ec384Pub ={kty:'EC', crv:'P-384', x:ec384Priv.x, y:ec384Priv.y};
var s384=P.signJws({alg:'ES384'}, 'hello world', ec384Priv);
ok(!s384.error, 'ES384 签发成功');
eq(s384.jws.split('.').length, 3, 'ES384 产出三段 JWS');
eq(P.b64urlDecode(s384.jws.split('.')[2]).length, 96, 'ES384 签名长度 = 2×48 字节');
eq(P.verifyJws(s384.jws, ec384Pub).verdict, 'VALID', 'ES384 自签自验一致');
eq(P.signJws({alg:'ES384'}, 'hello world', ec384Priv).jws, s384.jws,
   'RFC6979 确定性：同输入同签名（ES384）');
eq(P.verifyJws(s384.jws, A3_PUB).verdict, 'INVALID', 'ES384 换成别的公钥验签失败');

// ============ 8. HS384 / HS512 往返 ============
['HS384','HS512'].forEach(function(alg){
  var key={kty:'oct', k:P.b64url(seq(64))};
  var sg=P.signJws({alg:alg}, 'nano-tools', key);
  ok(!sg.error, alg+' 签发成功');
  eq(P.verifyJws(sg.jws, key).verdict, 'VALID', alg+' 自签自验一致');
  eq(P.verifyJws(sg.jws, {kty:'oct', k:P.b64url(seq(64,1))}).verdict, 'INVALID', alg+' 错误密钥验签失败');
});

// ============ 9. 解析：紧凑 / general / flattened / detached ============
var parsed=P.parseJws(A1_JWS);
eq(parsed.header.alg,'HS256','解析紧凑：alg');
eq(parsed.header.typ,'JWT','解析紧凑：typ');
eq(parsed.detached,false,'紧凑非 detached');
var genJson=JSON.stringify({payload:PL, signatures:[
  {protected:A1_HDR, signature:A1_SIG},
  {protected:A3_HDR, signature:A3_SIG}]});
var pg=P.parseJws(genJson);
eq(pg.format,'general','解析 general JSON');
eq(pg.signatures.length,2,'general JSON 含 2 个签名');
var vg=P.verifyJws(genJson, A3_PUB);
eq(vg.verdict,'VALID','general JSON 中任一签名可验证即判 VALID');
eq(vg.results[0].valid,false,'general JSON 中 HS256 签名用 EC 公钥验不过');
eq(vg.results[1].valid,true,'general JSON 中 ES256 签名用对应公钥验得过');
var flat=JSON.stringify({payload:PL, protected:A3_HDR, signature:A3_SIG});
var pf=P.parseJws(flat);
eq(pf.format,'flattened','解析 flattened JSON');
eq(P.verifyJws(flat, A3_PUB).verdict,'VALID','flattened JSON 验签通过');
var detached=A3_HDR+'..'+A3_SIG;
var pd=P.parseJws(detached);
eq(pd.detached,true,'解析 detached payload');
ok(P.parseJws('abc').error,'非三段紧凑串报错');
ok(P.parseJws('').error,'空输入报错');
ok(P.parseJws('{"payload":"x"}').error,'JSON 缺 signature 字段报错');

// ============ 10. 不支持 / 缺失场景优雅降级 ============
var psJws='eyJhbGciOiJQUzI1NiJ9.'+PL+'.'+P.b64url(seq(256,0xAA));
var rp=P.verifyJws(psJws, A2_PUB);
ok(rp.results[0].valid===null && /PSS/.test(rp.results[0].reason),'PS* 仅解析、验签提示走 WebCrypto');
var none=P.verifyJws('eyJhbGciOiJub25lIn0.'+PL+'.', A1_KEY);
ok(none.results[0].valid===false,'alg=none 一律判不通过');
var noKey=P.verifyJws(A2_JWS, {kty:'oct', k:'AAAA'});
ok(noKey.results[0].valid===false && /RSA/.test(noKey.results[0].reason),'RSA 验签缺 n/e 时给出明确原因');
ok(P.signJws({alg:'PS256'}, 'x', A2_PRIV).error,'PS* 不支持签发并明确报错');
ok(P.signJws({alg:'RS256'}, 'x', A2_PUB).error,'RSA 签发缺私钥 d 时报错');

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
