
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }
function has(hay,needle,msg){ ok(String(hay).indexOf(needle)>=0, msg+' (missing "'+needle+'" in '+JSON.stringify(String(hay).slice(0,160))+')'); }

// ---------- 行切分 ----------
eq(P.splitSdpLines('v=0\r\no=- 1 2 IN IP4 0.0.0.0\r\n').length, 2, 'CRLF 行切分');
eq(P.splitSdpLines('v=0\ro=x').length, 2, '裸 CR 也算换行');
eq(P.splitSdpLines('\uFEFFv=0').length, 1, 'BOM 被剥掉');
eq(P.splitSdpLines('\uFEFFv=0')[0], 'v=0', 'BOM 剥掉后首行完整');
eq(P.splitSdpLines('v=0\n\n\ns=-').length, 2, '空行忽略');
eq(P.splitSdpLines(null).length, 0, 'null 输入不炸');

eq(P.parseLine('a=mid:0').type, 'a', '行类型');
eq(P.parseLine('a=mid:0').value, 'mid:0', '行取值');
eq(P.parseLine('ab=x').malformed, true, '等号不在第 2 位即非法');
eq(P.parseLine('rubbish').malformed, true, '无等号即非法');

eq(P.parseAttribute('mid:0').name, 'mid', '属性名');
eq(P.parseAttribute('mid:0').value, '0', '属性值');
eq(P.parseAttribute('rtcp-mux').flag, true, '无值属性是 flag');
eq(P.parseAttribute('fmtp:111 a=1;b=2').value, '111 a=1;b=2', '属性值只按第一个冒号切');

// ---------- o= / m= / c= ----------
var o=P.parseOrigin('- 4611731400430051336 2 IN IP4 127.0.0.1');
eq(o.sessionId,'4611731400430051336','origin 会话 ID');
eq(o.address,'127.0.0.1','origin 地址');
eq(o.ok,true,'origin 6 段齐全');
eq(P.parseOrigin('- 1 2').ok,false,'origin 缺段');

var ml=P.parseMediaLine('audio 9 UDP/TLS/RTP/SAVPF 111 103 9');
eq(ml.kind,'audio','m= 类型');
eq(ml.port,9,'m= 端口');
eq(ml.proto,'UDP/TLS/RTP/SAVPF','m= 协议');
eq(ml.fmts.length,3,'m= 载荷个数');
eq(P.parseMediaLine('video 5000/2 RTP/AVP 96').portCount,2,'端口计数 port/N');
eq(P.parseConnection('IN IP4 0.0.0.0').address,'0.0.0.0','c= 地址');

// ---------- 指纹 ----------
var fp32=[]; for(var i=0;i<32;i++) fp32.push('AB');
var f=P.parseFingerprint('sha-256 '+fp32.join(':'));
eq(f.bytes,32,'sha-256 32 字节');
eq(f.ok,true,'sha-256 长度正确');
eq(P.parseFingerprint('sha-256 AB:CD').ok,false,'sha-256 长度不足要报错');
eq(P.parseFingerprint('sha-1 '+fp32.slice(0,20).join(':')).ok,true,'sha-1 20 字节');
eq(P.parseFingerprint('sha-256 '+fp32.slice(0,31).concat(['ZZ']).join(':')).ok,false,'非十六进制要报错');

// ---------- 地址分类 ----------
eq(P.ipKind('192.168.1.24').kind,'private','192.168 是内网');
eq(P.ipKind('10.0.0.5').kind,'private','10/8 是内网');
eq(P.ipKind('172.16.0.1').kind,'private','172.16/12 是内网');
eq(P.ipKind('172.32.0.1').kind,'public','172.32 不在私网段');
eq(P.ipKind('203.0.113.44').kind,'public','公网 IPv4');
eq(P.ipKind('169.254.1.1').kind,'linklocal','链路本地');
eq(P.ipKind('100.70.0.1').kind,'cgnat','CGNAT 段');
eq(P.ipKind('127.0.0.1').kind,'loopback','环回');
eq(P.ipKind('0.0.0.0').kind,'any','通配');
eq(P.ipKind('abc123.local').kind,'mdns','mDNS 主机名');
eq(P.ipKind('fe80::1').kind,'linklocal','IPv6 链路本地');
eq(P.ipKind('fd12::9').kind,'private','IPv6 ULA');
eq(P.ipKind('2001:db8::1').kind,'public','公网 IPv6');
eq(P.ipKind('::1').kind,'loopback','IPv6 环回');
eq(P.ipKind('999.1.1.1').kind,'invalid','非法 IPv4');
eq(P.ipKind('').kind,'unknown','空地址');

// ---------- 候选 ----------
var c=P.parseCandidate('a=candidate:2 1 udp 1686052607 203.0.113.44 52891 typ srflx raddr 192.168.1.24 rport 52891 generation 0 network-id 3 network-cost 10');
eq(c.foundation,'2','候选 foundation');
eq(c.component,1,'候选组件号');
eq(c.componentName,'RTP','组件名');
eq(c.transport,'udp','传输层');
eq(c.priority,1686052607,'候选优先级');
eq(c.address,'203.0.113.44','候选地址');
eq(c.port,52891,'候选端口');
eq(c.type,'srflx','候选类型');
eq(c.relatedAddress,'192.168.1.24','raddr');
eq(c.relatedPort,52891,'rport');
eq(c.generation,0,'generation');
eq(c.networkId,3,'network-id');
eq(c.networkCost,10,'network-cost');
eq(c.ok,true,'完整候选解析成功');
ok(!c.warn,'srflx 带了 raddr 就不该告警');

var chost=P.parseCandidate('candidate:1 1 udp 2122260223 192.168.1.24 52891 typ host');
eq(chost.type,'host','不带 a= 前缀也能解析');
eq(chost.ok,true,'最短合法候选');
eq(P.parseCandidate('1 1 udp 100 1.2.3.4 5 typ').ok,false,'段数不足要报错');
eq(P.parseCandidate('').ok,false,'空候选报错');
eq(P.parseCandidate('1 1 udp 100 1.2.3.4 5 xyz host').ok,false,'第 7 段不是 typ 要报错');
eq(P.parseCandidate('1 1 sctp 100 1.2.3.4 5 typ host').ok,false,'未知传输层要报错');
eq(P.parseCandidate('1 1 udp 100 1.2.3.4 70000 typ host').ok,false,'端口越界要报错');
eq(P.parseCandidate('1 1 tcp 100 1.2.3.4 9 typ host tcptype active').tcptype,'active','tcptype');
eq(P.parseCandidate('1 2 udp 100 1.2.3.4 9 typ host').componentName,'RTCP','组件 2 是 RTCP');
ok(!!P.parseCandidate('1 1 udp 100 1.2.3.4 9 typ relay').warn,'relay 缺 raddr 要提示');
eq(P.parseCandidate('1 1 udp 100 abc.local 9 typ host').addressKind.kind,'mdns','候选地址分类');

// ---------- 优先级 ----------
var d=P.decodePriority(2122260223);
eq(d.typePreference,126,'host 类型优先 126');
eq(d.componentId,1,'组件号 1');
eq(d.likelyType,'host','推测为 host');
eq(P.decodePriority(1686052607).typePreference,100,'srflx 类型优先 100');
eq(P.decodePriority(1686052607).likelyType,'srflx','推测为 srflx');
eq(P.decodePriority(41885439).typePreference,2,'relay 示例的类型优先');
eq(P.decodePriority(-1).ok,false,'负数优先级非法');
eq(P.decodePriority(1.5).ok,false,'小数优先级非法');
eq(P.decodePriority('x').ok,false,'非数字优先级非法');
eq(P.decodePriority(3000000000).ok,false,'超 31 位非法');

var b=P.buildPriority(126,65535,1);
eq(b.ok,true,'正算成功');
eq(b.priority,2130706431,'host/65535/RTP 是 host 候选的理论上限');
eq(P.decodePriority(2122260223).localPreference,32542,'Chrome 示例候选的本地优先值');
eq(P.decodePriority(b.priority).typePreference,126,'正反算一致：类型');
eq(P.decodePriority(b.priority).localPreference,65535,'正反算一致：本地');
eq(P.decodePriority(b.priority).componentId,1,'正反算一致：组件');
eq(P.buildPriority(0,0,2).priority,254,'relay/0/RTCP');
eq(P.buildPriority(127,0,1).ok,false,'类型优先超 126 非法');
eq(P.buildPriority(0,70000,1).ok,false,'本地优先超界非法');
eq(P.buildPriority(0,0,0).ok,false,'组件号 0 非法');

var pp=P.pairPriority(2122260223, 1686052607);
eq(pp.ok,true,'配对优先级可算');
eq(pp.value, 4294967296*1686052607 + 2*2122260223 + 1,'配对优先级公式');
eq(pp.exact,false,'超出双精度安全范围时如实标注');
eq(P.pairPriority(1,2).value, 4294967296*1 + 2*2 + 0,'受控方更大时末位为 0');
eq(P.pairPriority(1,2).exact,true,'小数值仍是精确的');
eq(P.pairPriority('a',2).ok,false,'非数字配对报错');

// ---------- 整份解析 ----------
function grabArea(id){
  var re = new RegExp('<textarea id="'+id+'"[^>]*>([\\s\\S]*?)</textarea>');
  return html.match(re)[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
             .replace(/\r\n/g,'\n');
}
var SDP = grabArea('sdp_in');
var doc = P.parseSdp(SDP);
eq(doc.version,'0','v=0');
eq(doc.media.length,2,'两条媒体');
eq(doc.media[0].kind,'audio','第一条是音频');
eq(doc.media[1].kind,'video','第二条是视频');
eq(doc.bundle.join(' '),'0 1','BUNDLE 组');
eq(doc.media[0].mid,'0','音频 mid');
eq(doc.media[0].direction,'sendrecv','音频方向');
eq(doc.media[1].direction,'sendonly','视频方向');
eq(doc.media[0].rtcpMux,true,'音频 rtcp-mux');
eq(doc.media[0].dtls.setup,'actpass','DTLS 角色');
eq(doc.media[0].ice.ufrag,'4ZcD','ice-ufrag');
eq(doc.media[0].candidates.length,3,'音频 3 条候选');
eq(doc.media[0].candidates[2].type,'relay','第三条是中继');
eq(doc.media[0].extmaps.length,1,'一个头部扩展');
eq(doc.media[0].extmaps[0].id,1,'扩展编号');
eq(doc.media[0].codecs.length,6,'音频 6 个载荷');
eq(doc.media[0].codecs[0].name,'opus','首选 opus');
eq(doc.media[0].codecs[0].clockRate,48000,'opus 采样率');
eq(doc.media[0].codecs[0].channels,2,'opus 双声道');
has(doc.media[0].codecs[0].fmtp,'useinbandfec=1','opus fmtp');
eq(doc.media[0].codecs[0].feedback.length,1,'opus 一条反馈');
eq(doc.media[1].codecs[1].name,'rtx','视频第二个是 rtx');
has(doc.media[1].codecs[1].fmtp,'apt=96','rtx 绑定 apt');
eq(doc.media[1].rtcpFb['96'].length,3,'VP8 三条反馈');
eq(doc.media[1].ssrcGroups.length,1,'一个 SSRC 组');
ok(!!doc.media[0].ssrcs['1815724'],'SSRC 记录');
eq(doc.media[0].ssrcs['1815724'].cname,'xR7NpqLmPz9','SSRC cname');
eq(doc.malformed.length,0,'示例没有畸形行');
eq(doc.media[0].rejected,false,'端口 9 不算被拒');

var s=P.summarize(doc);
eq(s.mediaCount,2,'摘要媒体数');
eq(s.candidates,3,'摘要候选数');
eq(s.byType.host,1,'摘要 host 计数');
eq(s.byType.relay,1,'摘要 relay 计数');
eq(s.trickle,true,'摘要识别 trickle');
eq(s.dtlsSetup,'actpass','摘要 DTLS 角色');
eq(P.stats(SDP)['媒体条数'],'2','stats 表格');

// ---------- 被拒媒体 ----------
var rej = P.parseSdp('v=0\no=- 1 2 IN IP4 0.0.0.0\ns=-\nt=0 0\nm=audio 0 UDP/TLS/RTP/SAVPF 0\na=mid:0');
eq(rej.media[0].rejected,true,'端口 0 = 被拒绝');
eq(P.summarize(rej).rejected,1,'摘要统计被拒条数');

// ---------- 体检 ----------
function levels(list,lv){ return list.filter(function(x){ return x.level===lv; }); }
var clean = P.lint(SDP);
eq(levels(clean,'error').length,0,'示例 SDP 无错误级问题');

var broken = P.lint('v=1\nm=audio 9 UDP/TLS/RTP/SAVPF 111');
ok(levels(broken,'error').length >= 4,'残缺 SDP 应报多处错误');
has(JSON.stringify(broken),'缺少 s= 行','缺 s= 被发现');
has(JSON.stringify(broken),'缺少 t= 行','缺 t= 被发现');
has(JSON.stringify(broken),'ice-ufrag','缺 ICE 凭证被发现');
has(JSON.stringify(broken),'fingerprint','缺指纹被发现');
has(JSON.stringify(broken),'a=rtpmap','载荷缺 rtpmap 被发现');
has(JSON.stringify(broken),'v= 应当是 0','版本号不对被发现');

var base='v=0\no=- 1 2 IN IP4 0.0.0.0\ns=-\nt=0 0\nc=IN IP4 0.0.0.0\n';
var creds='a=ice-ufrag:4ZcD\na=ice-pwd:2/1muCWoOi3uLifh0NuRHlZ7\na=fingerprint:sha-256 '+fp32.join(':')+'\na=setup:actpass\na=rtcp-mux\n';
function lintOf(extra){ return JSON.stringify(P.lint(base+'m=audio 9 UDP/TLS/RTP/SAVPF 111\n'+creds+'a=rtpmap:111 opus/48000/2\n'+extra)); }
has(lintOf('a=sendrecv\na=recvonly\n'),'方向属性','双方向属性被发现');
has(lintOf('a=sendrecv\na=extmap:1 uri-a\na=extmap:1 uri-b\n'),'extmap 编号 1 重复','扩展编号冲突被发现');
has(lintOf('a=sendrecv\na=rtpmap:97 PCMU/8000\n'),'没列出来','多余 rtpmap 被发现');
has(lintOf(''),'没有方向属性','缺方向被发现');
has(JSON.stringify(P.lint(base+'a=group:BUNDLE 0 9\nm=audio 9 UDP/TLS/RTP/SAVPF 111\n'+creds+'a=mid:0\na=sendrecv\na=rtpmap:111 opus/48000/2\n')),'不存在的 mid','BUNDLE 悬空 mid 被发现');
has(JSON.stringify(P.lint(base+'m=audio 9 UDP/TLS/RTP/SAVPF 111\na=ice-ufrag:4ZcD\na=ice-pwd:short\na=fingerprint:sha-256 '+fp32.join(':')+'\na=setup:actpass\na=sendrecv\na=rtpmap:111 opus/48000/2\n')),'ice-pwd 长度','短口令被发现');
has(JSON.stringify(P.lint(base+'m=audio 9 UDP/TLS/RTP/SAVPF 111\n'+creds.replace('actpass','bogus')+'a=sendrecv\na=rtpmap:111 opus/48000/2\n')),'a=setup 取值非法','setup 取值非法被发现');
has(JSON.stringify(P.lint(base+'m=audio 9 UDP/TLS/RTP/SAVPF 111\na=ice-ufrag:4ZcD\na=ice-pwd:2/1muCWoOi3uLifh0NuRHlZ7\na=fingerprint:sha-1 '+fp32.slice(0,20).join(':')+'\na=setup:actpass\na=rtcp-mux\na=sendrecv\na=rtpmap:111 opus/48000/2\n')),'sha-1','弱哈希被提示');

// ---------- offer / answer ----------
var ANSWER = grabArea('sdp_answer');
var neg = P.negotiate(SDP, ANSWER);
eq(neg.ok,true,'示例 offer/answer 能协商（'+JSON.stringify(neg.issues)+'）');
eq(neg.media.length,2,'逐媒体结果两条');
eq(neg.media[0].commonCodecs.length,1,'音频只剩 opus');
eq(neg.media[1].commonCodecs.length,2,'视频保留 VP8 + rtx');

var badDir = ANSWER.replace('a=recvonly','a=sendrecv');
has(JSON.stringify(P.negotiate(SDP,badDir).issues),'方向不互补','sendonly 对 sendrecv 要报错');
var badSetup = ANSWER.replace(/a=setup:active/g,'a=setup:actpass');
has(JSON.stringify(P.negotiate(SDP,badSetup).issues),'必须明确选','双 actpass 要报错');
var badPt = ANSWER.replace('a=rtpmap:96 VP8/90000','a=rtpmap:96 H264/90000');
has(JSON.stringify(P.negotiate(SDP,badPt).issues),'两边名字不同','同 PT 不同编解码器要报错');
var extraPt = ANSWER.replace('m=audio 9 UDP/TLS/RTP/SAVPF 111','m=audio 9 UDP/TLS/RTP/SAVPF 111 120')
                    .replace('a=rtpmap:111 opus/48000/2','a=rtpmap:111 opus/48000/2\na=rtpmap:120 speex/16000');
has(JSON.stringify(P.negotiate(SDP,extraPt).issues),'offer 里没有的载荷类型','answer 私加载荷要报错');
var swapped = ANSWER.replace(/m=audio([\s\S]*?)(?=m=video)/,'').concat('\n');
ok(P.negotiate(SDP,swapped).ok===false,'m 行数量不等要判失败');
var noMux = ANSWER.replace(/a=rtcp-mux\n/,'');
has(JSON.stringify(P.negotiate(SDP,noMux).issues),'rtcp-mux','answer 丢 rtcp-mux 要告警');
var midShift = ANSWER.replace('a=mid:1','a=mid:2');
has(JSON.stringify(P.negotiate(SDP,midShift).issues),'mid 对不上','mid 错位要报错');

// ---------- 脱敏 ----------
var red = P.redact(SDP);
ok(red.indexOf('203.0.113.44') < 0, '公网候选地址已抹去');
ok(red.indexOf('192.168.1.24') < 0, '内网候选地址已抹去');
ok(red.indexOf('2/1muCWoOi3uLifh0NuRHlZ7') < 0, 'ICE 口令已抹去');
ok(red.indexOf('xR7NpqLmPz9') < 0, 'cname 已抹去');
ok(red.indexOf('75:74:5A') < 0, 'DTLS 指纹已抹去');
has(red,'a=candidate:','候选行结构保留');
has(red,'typ srflx','候选类型保留');
has(red,'a=fingerprint:sha-256 XX:XX','指纹替换成占位');
eq(P.splitSdpLines(red).length, P.splitSdpLines(SDP).length, '脱敏不增删行');
eq(P.parseSdp(red).media.length, 2, '脱敏后依然解析得动');
eq(P.parseSdp(red).media[0].candidates.length, 3, '脱敏后候选仍在');
eq(P.maskAddress('203.0.113.44'),'203.0.x.x','IPv4 掩码保留前两段');
eq(P.maskAddress('abc.local'),'abc.local','mDNS 名字不动');
has(P.maskAddress('2001:db8:1:2::9'),'xxxx','IPv6 掩码');
var keepIp = P.redact(SDP, {ip:false});
has(keepIp,'203.0.113.44','关掉地址脱敏后地址保留');
ok(keepIp.indexOf('2/1muCWoOi3uLifh0NuRHlZ7') < 0, '关掉地址脱敏不影响口令');

// ---------- JSON 导出 ----------
var j = P.toJson(SDP);
eq(j.media.length,2,'JSON 两条媒体');
eq(j.media[0].codecs[0].name,'opus','JSON 编解码器');
eq(j.media[0].candidates.length,3,'JSON 候选');
eq(j.bundle.join(''),'01','JSON BUNDLE');
ok(JSON.stringify(j).length > 200,'JSON 有内容');

console.log((fail?'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
process.exit(fail?1:0);
