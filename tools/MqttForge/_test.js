
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }
function arr(u){ return Array.prototype.slice.call(u); }
function deq(a,b,msg){ eq(JSON.stringify(arr(a)), JSON.stringify(b), msg); }

// ---- UTF-8 ----
deq(P.utf8Encode('abc'),[97,98,99],'ascii encode');
deq(P.utf8Encode('中'),[0xE4,0xB8,0xAD],'cjk encode');
deq(P.utf8Encode('\u00e9'),[0xC3,0xA9],'latin1 supplement encode');
deq(P.utf8Encode('\ud83d\ude00'),[0xF0,0x9F,0x98,0x80],'emoji 4-byte encode');
eq(P.utf8Decode(P.utf8Encode('中文 abc'),0),'中文 abc','utf8 round trip');
eq(P.utf8Decode(P.utf8Encode('\ud83d\ude00'),0),'\ud83d\ude00','emoji round trip');
eq(P.utf8Encode('').length,0,'empty encode');

// ---- remaining-length varint (MQTT 2.2.3) ----
deq(P.encodeVarint(0),[0x00],'varint 0');
deq(P.encodeVarint(127),[0x7F],'varint 127 single byte');
deq(P.encodeVarint(128),[0x80,0x01],'varint 128 two bytes');
deq(P.encodeVarint(16383),[0xFF,0x7F],'varint 16383');
deq(P.encodeVarint(16384),[0x80,0x80,0x01],'varint 16384 three bytes');
deq(P.encodeVarint(2097151),[0xFF,0xFF,0x7F],'varint 2097151');
deq(P.encodeVarint(2097152),[0x80,0x80,0x80,0x01],'varint 2097152 four bytes');
deq(P.encodeVarint(268435455),[0xFF,0xFF,0xFF,0x7F],'varint max');
(function(){ let threw=false; try{ P.encodeVarint(268435456); }catch(e){ threw=true; } ok(threw,'varint overflow throws'); })();
(function(){ let threw=false; try{ P.encodeVarint(-1); }catch(e){ threw=true; } ok(threw,'negative varint throws'); })();

var dv=P.decodeVarint([0x80,0x01],0);
eq(dv.value,128,'decode varint 128');
eq(dv.bytes,2,'decode varint byte count');
eq(dv.next,2,'decode varint next offset');
eq(P.decodeVarint([0xFF,0xFF,0xFF,0x7F],0).value,268435455,'decode varint max');
ok(!P.decodeVarint([0xFF,0xFF,0xFF,0xFF,0x7F],0).ok,'5-byte varint rejected');
ok(!P.decodeVarint([0x80],0).ok,'truncated varint rejected');
// round trip across all boundaries
[0,1,127,128,255,16383,16384,65535,2097151,2097152,268435455].forEach(function(n){
  eq(P.decodeVarint(P.encodeVarint(n),0).value, n, 'varint round trip '+n);
});

// ---- MQTT strings ----
deq(P.encodeString('MQTT'),[0x00,0x04,0x4D,0x51,0x54,0x54],'encodeString MQTT');
deq(P.encodeString(''),[0x00,0x00],'encodeString empty');
var rs=P.readString([0x00,0x04,0x4D,0x51,0x54,0x54],0);
eq(rs.value,'MQTT','readString value');
eq(rs.next,6,'readString next');
ok(!P.readString([0x00,0x04,0x4D],0).ok,'truncated string rejected');
ok(!P.readString([0x00],0).ok,'truncated length rejected');

// ---- CONNECT ----
var conn=P.buildConnect({clientId:'abc', keepAlive:60, clean:true});
eq(conn[0],0x10,'CONNECT fixed header');
eq(conn[1],conn.length-2,'CONNECT remaining length matches');
var dc=P.decodePacket(conn);
eq(dc.typeName,'CONNECT','CONNECT type name');
eq(dc.protocolLevel,4,'protocol level 4 (3.1.1)');
eq(dc.clientId,'abc','clientId round trip');
eq(dc.keepAlive,60,'keepAlive round trip');
eq(dc.clean,true,'clean flag');
eq(dc.hasUsername,false,'no username flag');
eq(dc.hasPassword,false,'no password flag');
eq(dc.willFlag,false,'no will flag');
eq(dc.totalLength,conn.length,'CONNECT total length');

var conn2=P.buildConnect({clientId:'x', username:'u', password:'p', keepAlive:30, clean:false,
                          will:{topic:'st/x', payload:'off', qos:1, retain:true}});
var dc2=P.decodePacket(conn2);
eq(dc2.hasUsername,true,'username flag set');
eq(dc2.hasPassword,true,'password flag set');
eq(dc2.username,'u','username round trip');
eq(dc2.password,'p','password round trip');
eq(dc2.clean,false,'clean=false');
eq(dc2.willFlag,true,'will flag');
eq(dc2.willQos,1,'will qos');
eq(dc2.willRetain,true,'will retain');
eq(dc2.willTopic,'st/x','will topic');
eq(dc2.willPayload,'off','will payload');
eq(dc2.keepAlive,30,'keepAlive 30');
eq(P.decodePacket(P.buildConnect({clientId:'', clean:true})).clientId,'','empty clientId allowed');
eq(P.decodePacket(P.buildConnect({clientId:'中文id'})).clientId,'中文id','utf8 clientId round trip');
eq(P.decodePacket(P.buildConnect({keepAlive:65535})).keepAlive,65535,'keepAlive max');

// ---- PUBLISH ----
var pub=P.buildPublish({topic:'a/b', payload:'hi', qos:0});
eq(pub[0],0x30,'PUBLISH qos0 header byte');
var dp=P.decodePacket(pub);
eq(dp.typeName,'PUBLISH','PUBLISH type');
eq(dp.topic,'a/b','publish topic');
eq(dp.payload,'hi','publish payload');
eq(dp.qos,0,'publish qos0');
eq(dp.retain,false,'no retain');
eq(dp.dup,false,'no dup');
ok(dp.packetId===undefined,'qos0 has no packet id');

var pub1=P.buildPublish({topic:'a', payload:'x', qos:1, retain:true, dup:true, packetId:1234});
eq(pub1[0], 0x30|0x08|0x02|0x01, 'PUBLISH dup+qos1+retain header bits');
var dp1=P.decodePacket(pub1);
eq(dp1.qos,1,'qos1 decoded');
eq(dp1.retain,true,'retain decoded');
eq(dp1.dup,true,'dup decoded');
eq(dp1.packetId,1234,'packet id decoded');
eq(P.decodePacket(P.buildPublish({topic:'t', payload:'', qos:0})).payloadBytes,0,'empty payload');
eq(P.decodePacket(P.buildPublish({topic:'t', payload:'温度 23.5℃', qos:0})).payload,'温度 23.5℃','utf8 payload round trip');
// large payload forces multi-byte remaining length
var big=new Array(300).join('x');
var pubBig=P.buildPublish({topic:'t', payload:big, qos:0});
eq(P.decodePacket(pubBig).payload.length, big.length, 'large payload survives multi-byte remaining length');
eq(P.decodePacket(pubBig).headerLength, 3, 'remaining length took 2 bytes');
// binary payload
eq(P.decodePacket(P.buildPublish({topic:'t', payload:[0x41,0x42], qos:0})).payload,'AB','array payload');

// ---- SUBSCRIBE / UNSUBSCRIBE ----
var sub=P.buildSubscribe({packetId:7, subscriptions:[{topic:'a/#', qos:1},{topic:'b/+', qos:2}]});
eq(sub[0],0x82,'SUBSCRIBE reserved flags must be 0010');
var ds=P.decodePacket(sub);
eq(ds.typeName,'SUBSCRIBE','SUBSCRIBE type');
eq(ds.packetId,7,'subscribe packet id');
eq(ds.subscriptions.length,2,'two subscriptions');
eq(ds.subscriptions[0].topic,'a/#','sub topic 1');
eq(ds.subscriptions[0].qos,1,'sub qos 1');
eq(ds.subscriptions[1].topic,'b/+','sub topic 2');
eq(ds.subscriptions[1].qos,2,'sub qos 2');
(function(){ let threw=false; try{ P.buildSubscribe({packetId:1, subscriptions:[]}); }catch(e){ threw=true; } ok(threw,'empty SUBSCRIBE throws'); })();
var unsub=P.decodePacket(P.buildUnsubscribe({packetId:9, topics:['a','b']}));
eq(unsub.typeName,'UNSUBSCRIBE','UNSUBSCRIBE type');
eq(unsub.subscriptions.length,2,'two unsub topics');
eq(unsub.packetId,9,'unsub packet id');

// ---- tiny packets ----
deq(P.buildPingReq(),[0xC0,0x00],'PINGREQ bytes');
deq(P.buildDisconnect(),[0xE0,0x00],'DISCONNECT bytes');
deq(P.buildPubAck(5),[0x40,0x02,0x00,0x05],'PUBACK bytes');
eq(P.decodePacket(P.buildPingReq()).typeName,'PINGREQ','PINGREQ decode');
eq(P.decodePacket(P.buildDisconnect()).typeName,'DISCONNECT','DISCONNECT decode');
eq(P.decodePacket(P.buildPubAck(5)).packetId,5,'PUBACK packet id');

// ---- CONNACK / SUBACK decode ----
var ca=P.decodePacket([0x20,0x02,0x01,0x00]);
eq(ca.typeName,'CONNACK','CONNACK type');
eq(ca.sessionPresent,true,'session present');
eq(ca.returnCode,0,'connack accepted');
eq(ca.returnName,'Accepted','connack name');
eq(P.decodePacket([0x20,0x02,0x00,0x05]).returnName,'Not authorized','connack 5');
eq(P.decodePacket([0x20,0x02,0x00,0x09]).returnName,'未知返回码','unknown connack code');
var sa=P.decodePacket([0x90,0x04,0x00,0x07,0x01,0x80]);
eq(sa.typeName,'SUBACK','SUBACK type');
eq(sa.packetId,7,'suback packet id');
eq(sa.returnCodes.length,2,'two suback codes');
eq(sa.returnCodes[1],0x80,'suback failure code');

// ---- decode robustness ----
ok(!P.decodePacket([0x30]).ok,'1-byte packet rejected');
ok(!P.decodePacket([]).ok,'empty packet rejected');
eq(P.decodePacket([0x30,0x10,0x00,0x01,0x61]).truncated,true,'truncation detected');
(function(){
  var two = arr(P.buildPingReq()).concat(arr(P.buildDisconnect()));
  var d = P.decodePacket(two);
  eq(d.typeName,'PINGREQ','first of two concatenated packets');
  eq(d.extra,2,'extra trailing bytes reported');
})();

// ---- topic matching (MQTT 4.7) ----
ok(P.topicMatch('sport/tennis/player1','sport/tennis/player1'),'exact match');
ok(!P.topicMatch('sport/tennis/player1','sport/tennis/player2'),'exact mismatch');
ok(P.topicMatch('sport/tennis/+','sport/tennis/player1'),'+ single level');
ok(!P.topicMatch('sport/tennis/+','sport/tennis/player1/score'),'+ does not span levels');
ok(P.topicMatch('sport/+','sport/'),'+ matches empty level');
ok(!P.topicMatch('sport/+','sport'),'+ requires the level to exist');
ok(P.topicMatch('sport/#','sport/tennis/player1'),'# multi level');
ok(P.topicMatch('sport/#','sport'),'# also matches the parent level');
ok(P.topicMatch('#','a/b/c'),'bare # matches everything');
ok(P.topicMatch('+/+','a/b'),'multiple +');
ok(!P.topicMatch('+/+','a'),'multiple + needs both levels');
ok(!P.topicMatch('#','$SYS/broker/uptime'),'# must not match $ topics');
ok(!P.topicMatch('+/monitor','$SYS/monitor'),'+ must not match $ topics');
ok(P.topicMatch('$SYS/#','$SYS/broker/uptime'),'explicit $SYS filter works');
ok(P.topicMatch('/a','/a'),'leading slash empty level');
ok(!P.topicMatch('a','/a'),'leading slash is significant');
ok(!P.topicMatch('a/b','a/b/'),'trailing slash is significant');
ok(!P.topicMatch('','a'),'empty filter never matches');
ok(!P.topicMatch('a',''),'empty topic never matches');
ok(P.topicMatch('a/+/c','a//c'),'+ matches an empty middle level');

// ---- topic validation ----
ok(P.validateTopic('a/b/c',false).ok,'plain topic valid');
ok(!P.validateTopic('',false).ok,'empty topic invalid');
ok(!P.validateTopic('a/+',false).ok,'wildcard illegal in publish topic');
ok(!P.validateTopic('a/#',false).ok,'# illegal in publish topic');
ok(P.validateTopic('a/#',true).ok,'# legal in filter');
ok(!P.validateTopic('a/#/b',true).ok,'# must be last level');
ok(!P.validateTopic('a/b#',true).ok,'# must occupy the whole level');
ok(!P.validateTopic('a/+b',true).ok,'+ must occupy the whole level');
ok(P.validateTopic('a/+/b',true).ok,'+ mid filter valid');
ok(!P.validateTopic('a\u0000b',false).ok,'NUL rejected');
eq(P.validateTopic('a/b/c',false).levels,3,'level count');
eq(P.validateTopic('中',false).bytes,3,'utf8 byte count');
ok(P.validateTopic('$SYS/x',true).warnings.length>0,'$ prefix warned');
ok(P.validateTopic('/a',false).warnings.length>0,'leading slash warned');
ok(P.validateTopic('a/',false).warnings.length>0,'trailing slash warned');
ok(P.validateTopic('a//b',false).warnings.length>0,'double slash warned');
ok(P.validateTopic('a b',false).warnings.length>0,'whitespace warned');

// ---- hex helpers ----
eq(P.hex([0x00,0xFF,0x0A]),'00 FF 0A','hex formatting');
var ph=P.parseHex('20 02 00 00');
ok(ph.ok,'parseHex ok');
deq(ph.bytes,[0x20,0x02,0x00,0x00],'parseHex bytes');
deq(P.parseHex('0x20,0x02').bytes,[0x20,0x02],'parseHex tolerates 0x and commas');
deq(P.parseHex('2002').bytes,[0x20,0x02],'parseHex handles contiguous hex');
ok(!P.parseHex('').ok,'parseHex empty rejected');
ok(!P.parseHex('2 0').ok,'parseHex odd-length group rejected');
ok(P.hexdump([0x41,0x42]).indexOf('|AB')>0,'hexdump ascii column');
ok(P.hexdump([0x00]).indexOf('0000')===0,'hexdump offset column');

// ---- lint ----
function msgs(cfg){ return P.lint(cfg).map(function(i){ return i.level+':'+i.msg; }).join('\n'); }
ok(msgs({clientId:'', clean:false}).indexOf('error:')>=0,'empty clientId + persistent session errors');
ok(msgs({clientId:'', clean:true}).indexOf('服务端分配')>=0,'empty clientId hinted');
ok(msgs({clientId:new Array(30).join('a')}).indexOf('1–23 字节')>=0,'long clientId warned');
ok(msgs({clientId:'a-b'}).indexOf('非字母数字')>=0,'non-alnum clientId warned');
ok(msgs({clientId:'a', password:'p'}).indexOf('不允许携带密码')>=0,'password without username errors');
ok(msgs({clientId:'a', keepAlive:0}).indexOf('关闭保活')>=0,'keepAlive 0 warned');
ok(msgs({clientId:'a', keepAlive:70000}).indexOf('超过 65535')>=0,'keepAlive overflow errors');
ok(msgs({clientId:'a', keepAlive:600}).indexOf('1.5 倍')>=0,'long keepAlive hinted');
ok(msgs({clientId:'a', qos:2}).indexOf('四步握手')>=0,'qos2 hinted');
ok(msgs({clientId:'a', qos:0, retain:true}).indexOf('至多一次')>=0,'qos0 retain hinted');
ok(msgs({clientId:'a', url:'ws://x/mqtt'}).indexOf('明文 ws://')>=0,'plaintext ws warned');
ok(msgs({clientId:'a', url:'wss://x/weird'}).indexOf('/mqtt')>=0,'unusual path hinted');
ok(msgs({clientId:'a', topic:'a/#', isFilter:false}).indexOf('不允许包含通配符')>=0,'wildcard publish topic errors');
ok(msgs({clientId:'a', will:{topic:'a/+'}}).indexOf('遗嘱主题')>=0,'bad will topic errors');
ok(msgs({clientId:'a', will:{topic:'st/a'}}).indexOf('retain')>=0,'will without retain hinted');

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
process.exit(fail?1:0);
