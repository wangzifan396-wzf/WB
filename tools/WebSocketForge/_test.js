
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }

// ---- parseWsUrl ----
var u=P.parseWsUrl('wss://example.com/socket?token=1');
ok(u.ok,'parse wss ok');
eq(u.scheme,'wss','scheme wss');
eq(u.host,'example.com','host');
eq(u.port,null,'no explicit port');
eq(u.effectivePort,443,'default 443');
eq(u.path,'/socket','path');
eq(u.query,'token=1','query');
eq(u.secure,true,'secure');

var u2=P.parseWsUrl('ws://127.0.0.1:8080');
ok(u2.ok,'parse ws host:port');
eq(u2.port,8080,'explicit port');
eq(u2.path,'/','default path');
eq(u2.effectivePort,8080,'effective port');
eq(u2.normalized,'ws://127.0.0.1:8080/','normalized keeps port');

var u3=P.parseWsUrl('https://api.test/stream');
ok(u3.ok,'https auto-upgrades');
eq(u3.scheme,'wss','https -> wss');
eq(u3.upgradedFrom,'https','records original scheme');

var u4=P.parseWsUrl('wss://[2001:db8::1]:9443/x');
ok(u4.ok,'ipv6 parses');
eq(u4.host,'[2001:db8::1]','ipv6 host kept bracketed');
eq(u4.port,9443,'ipv6 port');

ok(!P.parseWsUrl('').ok,'empty rejected');
ok(!P.parseWsUrl('example.com').ok,'missing scheme rejected');
ok(!P.parseWsUrl('ftp://example.com').ok,'ftp rejected');
ok(!P.parseWsUrl('ws://example.com:abc').ok,'non-numeric port rejected');
ok(!P.parseWsUrl('ws://example.com:0').ok,'port 0 rejected');
ok(!P.parseWsUrl('ws://example.com:70000').ok,'port overflow rejected');
ok(!P.parseWsUrl('ws://example.com:').ok,'empty port rejected');
eq(P.parseWsUrl('ws://u:p@h/x').userinfo,'u:p','userinfo captured');
eq(P.parseWsUrl('ws://h/x#frag').hash,'frag','hash captured');
eq(P.parseWsUrl('ws://h/x#frag').path,'/x','hash stripped from path');

// ---- subprotocols ----
var sp=P.parseSubprotocols('graphql-ws, mqtt , graphql-ws, bad proto');
eq(sp.list.length,2,'two valid subprotocols');
eq(sp.list[0],'graphql-ws','first subprotocol');
eq(sp.duplicates.length,1,'duplicate detected');
eq(sp.invalid.length,1,'space makes it invalid');
eq(P.parseSubprotocols('').list.length,0,'empty subprotocols');

// ---- utf8Length ----
eq(P.utf8Length('abc'),3,'ascii len');
eq(P.utf8Length('中文'),6,'cjk 3 bytes each');
eq(P.utf8Length('\u00e9'),2,'latin1 supplement 2 bytes');
eq(P.utf8Length('\ud83d\ude00'),4,'emoji surrogate pair 4 bytes');
eq(P.utf8Length(''),0,'empty len');

// ---- frameOverhead (RFC 6455) ----
var f1=P.frameOverhead(10,false);
eq(f1.headerBytes,2,'small payload 2-byte header');
eq(f1.maskBytes,0,'unmasked');
eq(f1.total,12,'total unmasked');
var f2=P.frameOverhead(10,true);
eq(f2.maskBytes,4,'masked adds 4');
eq(f2.total,16,'total masked');
eq(P.frameOverhead(125,false).headerBytes,2,'125 still inline');
eq(P.frameOverhead(126,false).headerBytes,4,'126 needs 16-bit ext');
eq(P.frameOverhead(65535,false).headerBytes,4,'65535 still 16-bit');
eq(P.frameOverhead(65536,false).headerBytes,10,'65536 needs 64-bit ext');
eq(P.frameOverhead(0,true).ratio,null,'zero payload ratio null');
eq(P.frameOverhead(-5,true).payload,0,'negative clamps to 0');

// ---- backoff ----
var b0=P.backoff(0,{base:500,factor:2,max:30000,jitter:'none'});
eq(b0.capped,500,'attempt0 = base');
eq(b0.min,500,'no jitter min');
eq(b0.max,500,'no jitter max');
eq(P.backoff(3,{base:500,factor:2,max:30000,jitter:'none'}).capped,4000,'attempt3 = 4000');
eq(P.backoff(10,{base:500,factor:2,max:30000,jitter:'none'}).capped,30000,'cap applied');
var bf=P.backoff(2,{base:1000,factor:2,max:60000,jitter:'full'});
eq(bf.min,0,'full jitter min 0');
eq(bf.max,4000,'full jitter max = capped');
var be=P.backoff(2,{base:1000,factor:2,max:60000,jitter:'equal'});
eq(be.min,2000,'equal jitter half');
eq(be.max,4000,'equal jitter cap');
var sch=P.backoffSchedule(4,{base:100,factor:2,max:10000,jitter:'none'});
eq(sch.length,4,'schedule length');
eq(sch[3].cumulative,100+200+400+800,'cumulative sums');
eq(P.backoffSchedule(0,{}).length,0,'zero schedule');

// ---- template ----
var det=function(){ return 0.5; };
eq(P.applyTemplate('n={{seq}}',{seq:7}),'n=7','seq substitution');
eq(P.applyTemplate('t={{ts}}',{ts:1234}),'t=1234','ts substitution');
eq(P.applyTemplate('{{iso}}',{ts:0}),'1970-01-01T00:00:00.000Z','iso substitution');
eq(P.applyTemplate('{{rand:1-1}}',{rand:det}),'1','rand fixed range');
ok(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/.test(P.applyTemplate('{{uuid}}',{rand:det})),'uuid shape');
eq(P.applyTemplate('{{unknown}}',{}),'{{unknown}}','unknown token left as-is');
eq(P.applyTemplate('no tokens',{}),'no tokens','plain passthrough');

// ---- classifyMessage ----
var cj=P.classifyMessage('{"a":1}');
eq(cj.kind,'json','json detected');
ok(cj.pretty.indexOf('\n')>=0,'json pretty-printed');
eq(P.classifyMessage('{bad json').kind,'text','broken json falls back to text');
eq(P.classifyMessage('hello').kind,'text','plain text');
eq(P.classifyMessage(null).kind,'empty','null empty');
eq(P.classifyMessage({byteLength:8}).kind,'binary','binary by byteLength');
eq(P.classifyMessage({byteLength:8}).size,8,'binary size');

// ---- close codes ----
eq(P.explainClose(1000).kind,'normal','1000 normal');
eq(P.explainClose(1006).kind,'reserved','1006 reserved');
eq(P.explainClose(1006).sendable,false,'1006 not sendable');
eq(P.explainClose(3001).kind,'app','3000s registered');
eq(P.explainClose(4500).kind,'app','4000s private');
eq(P.explainClose(4500).sendable,true,'private sendable');
eq(P.explainClose(2000).kind,'reserved','2000 unassigned');
eq(P.explainClose(9999).kind,'error','out of range');
eq(P.explainClose('abc').kind,'error','non numeric');
eq(P.explainClose(1004).sendable,false,'1004 not sendable');

// ---- stats ----
var st=P.stats([{dir:'out',size:10,t:1000},{dir:'in',size:20,t:2000},{dir:'in',size:5,t:3000,kind:'error'}]);
eq(st.total,3,'stats total');
eq(st.sent,1,'stats sent');
eq(st.recv,2,'stats recv');
eq(st.payloadBytes,35,'payload bytes');
eq(st.errors,1,'error counted');
eq(st.durationMs,2000,'duration');
eq(st.wireBytes, P.frameOverhead(10,true).total + P.frameOverhead(20,false).total + P.frameOverhead(5,false).total, 'wire bytes use masking by direction');
eq(P.stats([]).total,0,'empty stats');

// ---- pingStats ----
var ps=P.pingStats([10,20,30,40]);
eq(ps.count,4,'ping count');
eq(ps.min,10,'ping min');
eq(ps.max,40,'ping max');
eq(ps.avg,25,'ping avg');
eq(P.pingStats([]).count,0,'empty ping stats');
eq(P.pingStats([5]).jitter,0,'single sample zero jitter');

// ---- formatBytes ----
eq(P.formatBytes(512),'512 B','bytes');
eq(P.formatBytes(2048),'2.0 KB','kb');
eq(P.formatBytes(2*1048576),'2.00 MB','mb');

// ---- lint ----
function msgs(cfg){ return P.lint(cfg).map(function(i){ return i.level+':'+i.msg; }).join('\n'); }
ok(msgs({url:'nope'}).indexOf('error:')===0,'bad url errors');
ok(msgs({url:'ws://public.example.com',pingInterval:0,reconnect:false}).indexOf('明文 ws://')>=0,'plaintext warned');
ok(msgs({url:'ws://localhost:1234',pingInterval:25000,reconnect:true,backoff:{jitter:'full'}}).indexOf('中间人')<0,'localhost skips MITM warning');
ok(msgs({url:'wss://a.b',pingInterval:0,reconnect:true,backoff:{jitter:'full'}}).indexOf('未启用心跳')>=0,'no heartbeat warned');
ok(msgs({url:'wss://a.b',pingInterval:25000,reconnect:false}).indexOf('未开启自动重连')>=0,'no reconnect warned');
ok(msgs({url:'wss://a.b',pingInterval:25000,reconnect:true,backoff:{jitter:'none'}}).indexOf('惊群')>=0,'no jitter warned');
ok(msgs({url:'wss://a.b?token=xyz',pingInterval:25000,reconnect:true,backoff:{jitter:'full'}}).indexOf('凭据')>=0,'credential in query warned');
ok(msgs({url:'wss://u:p@a.b',pingInterval:25000,reconnect:true,backoff:{jitter:'full'}}).indexOf('user:pass')>=0,'userinfo warned');
ok(msgs({url:'wss://a.b',pingInterval:25000,reconnect:true,backoff:{jitter:'full'},payloadSize:2000000}).indexOf('1009')>=0,'oversized payload warned');
ok(msgs({url:'wss://a.b',pingInterval:25000,reconnect:true,backoff:{jitter:'full'},payloadSize:2}).indexOf('开销率')>=0,'tiny payload overhead hinted');
ok(msgs({url:'wss://a.b',subprotocols:'bad proto',pingInterval:25000,reconnect:true,backoff:{jitter:'full'}}).indexOf('非法字符')>=0,'invalid subprotocol errors');
ok(msgs({url:'http://a.b',pingInterval:25000,reconnect:true,backoff:{jitter:'full'}}).indexOf('自动把 http')>=0,'scheme upgrade noted');

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
process.exit(fail?1:0);
