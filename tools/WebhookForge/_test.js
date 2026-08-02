const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

ok(P.hmacSha256Hex('key','The quick brown fox jumps over the lazy dog')==='f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8', 'HMAC-SHA256 matches RFC test vector');
ok(P.hmacSha256Hex('','').length===64, 'HMAC output is 64 hex chars');
ok(P.hmacSha256Hex('a','x')!==P.hmacSha256Hex('b','x'), 'different keys give different digests');
const longKey='k'.repeat(200);
ok(P.hmacSha256Hex(longKey,'m').length===64, 'keys longer than block size are hashed down');

const st=P.signPayload('stripe','sec','{"a":1}',1750000000);
ok(/^t=1750000000,v1=[0-9a-f]{64}$/.test(st.value), 'stripe header format');
ok(st.base==='1750000000.{"a":1}', 'stripe signs ts.body');
const gh=P.signPayload('github','sec','{"a":1}',0);
ok(gh.value.indexOf('sha256=')===0, 'github header prefix');
ok(gh.base==='{"a":1}', 'github signs raw body');
const sl=P.signPayload('slack','sec','body',1700);
ok(sl.base==='v0:1700:body', 'slack signs v0:ts:body');
ok(P.signPayload('nope','s','b',0).error!==null, 'unknown provider reports error');

ok(P.extractHex('stripe','t=1,v1=ABCDEF')==='abcdef', 'extractHex reads stripe v1 lowercased');
ok(P.extractHex('github','sha256=DEAD')==='dead', 'extractHex strips scheme prefix');
ok(P.extractHex('generic','beef')==='beef', 'extractHex handles bare hex');
ok(P.extractHex('stripe','t=1,v0=zz')==='', 'extractHex returns empty when v1 absent');
ok(P.extractTs('t=1750000000,v1=aa')===1750000000, 'extractTs reads timestamp');
ok(P.extractTs('sha256=aa')===null, 'extractTs null when no timestamp');

ok(P.timingSafeEqual('abc','abc')===true, 'timingSafeEqual accepts identical');
ok(P.timingSafeEqual('abc','abd')===false, 'timingSafeEqual rejects different');
ok(P.timingSafeEqual('abc','ab')===false, 'timingSafeEqual rejects length mismatch');

const good=P.verifyWebhook({provider:'stripe',secret:'sec',body:'{"a":1}',header:st.value,now:1750000060});
ok(good.ok===true, 'valid stripe signature verifies');
ok(good.checks.length===3, 'stripe verification runs three checks');
const stale=P.verifyWebhook({provider:'stripe',secret:'sec',body:'{"a":1}',header:st.value,now:1750001000});
ok(stale.ok===false && /重放/.test(stale.reason), 'stale timestamp is rejected as replay');
const wrong=P.verifyWebhook({provider:'stripe',secret:'other',body:'{"a":1}',header:st.value,now:1750000060});
ok(wrong.ok===false && /HMAC/.test(wrong.reason), 'wrong secret fails HMAC compare');
ok(P.verifyWebhook({provider:'github',secret:'s',body:'b',header:''}).ok===false, 'empty header fails parse');
const tampered=P.verifyWebhook({provider:'github',secret:'sec',body:'{"a":2}',header:P.signPayload('github','sec','{"a":1}',0).value});
ok(tampered.ok===false, 'tampered body fails verification');

const rs=P.retrySchedule({attempts:5,base:1,factor:2,cap:3600,jitter:'none'});
ok(rs.rows.length===5, 'retrySchedule honours attempt count');
ok(rs.rows[0].delay===1 && rs.rows[4].delay===16, 'exponential backoff doubles each attempt');
ok(rs.total===31, 'no-jitter total equals sum of delays');
const cap=P.retrySchedule({attempts:12,base:1,factor:2,cap:60,jitter:'none'});
ok(cap.capped===true, 'cap flag set when delay exceeds ceiling');
ok(cap.rows[11].delay===60, 'delays clamp to cap');
const fj=P.retrySchedule({attempts:3,base:2,factor:2,jitter:'full'});
ok(fj.rows[0].min===0 && fj.rows[0].max===2, 'full jitter spans zero to delay');
const ej=P.retrySchedule({attempts:2,base:4,factor:2,jitter:'equal'});
ok(ej.rows[0].min===2 && ej.rows[0].max===4, 'equal jitter spans half to full');
ok(P.retrySchedule({attempts:0}).rows.length===1, 'attempts floor at one');
ok(P.humanDuration(90)==='1 分 30 秒', 'humanDuration formats minutes');
ok(P.humanDuration(7200)==='2 小时 0 分', 'humanDuration formats hours');

ok(P.deliverySuccess(0.5,1).value===0.5, 'single attempt equals success rate');
ok(P.deliverySuccess(0.9,3).value===0.999, 'three attempts compound to 99.9%');
ok(P.deliverySuccess(1,5).lostPerMillion===0, 'perfect rate loses nothing');

const li=P.lintPayload('{"id":"e1","type":"a.b","created":1}');
ok(li.json===true && li.issues.length===0, 'well-formed event passes lint');
ok(P.lintPayload('not json').json===false, 'invalid JSON detected');
ok(P.lintPayload('{"a":1}').issues.length===3, 'missing id/type/created flagged');
ok(P.lintPayload('{"id":1,"type":"t","created":1,"secret":"x"}').issues.some(function(i){return /凭据/.test(i.msg);}), 'plaintext credential flagged');
ok(P.lintPayload('').issues.some(function(i){return /空/.test(i.msg);}), 'empty payload flagged');
ok(P.fmtBytes(2048)==='2 KB', 'fmtBytes formats kilobytes');

const c=P.curlCommand({provider:'github',secret:'s',body:'{"a":1}',url:'https://h.example/x'});
ok(c.indexOf('X-Hub-Signature-256')>0, 'curl includes provider header');
ok(c.indexOf('https://h.example/x')>0, 'curl targets given url');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
