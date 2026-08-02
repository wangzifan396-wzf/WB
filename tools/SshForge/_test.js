
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }

function u64(n){
  var hi=Math.floor(n/4294967296)>>>0, lo=(n>>>0);
  return [(hi>>>24)&0xff,(hi>>>16)&0xff,(hi>>>8)&0xff,hi&0xff,(lo>>>24)&0xff,(lo>>>16)&0xff,(lo>>>8)&0xff,lo&0xff];
}
function u32(n){ return [(n>>>24)&0xff,(n>>>16)&0xff,(n>>>8)&0xff,n&0xff]; }
function S(b){ return u32(b.length).concat(b); }
function fill(n,v){ var a=[]; for(var i=0;i<n;i++) a.push(v); return a; }

// ---- 真实世界已知答案：GitHub 公示的 ssh-ed25519 主机密钥指纹 ----
const GH='AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl';
var gh=P.decodeKey('ssh-ed25519', GH);
eq(gh.sha256,'SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU','GitHub 主机密钥 SHA256 指纹与官方公示一致');
eq(gh.md5,'MD5:65:96:2d:fc:e8:d5:a9:11:64:0c:0f:ea:00:6e:5b:bd','MD5 指纹格式与取值');
eq(gh.bits,256,'ed25519 位数');
eq(gh.label,'Ed25519','ed25519 标签');
eq(gh.isCert,false,'不是证书');
eq(gh.rest,0,'wire 数据被完整消费');
eq(gh.fields.length,2,'ed25519 两个字段');
eq(gh.fields[1].name,'A','第二字段是曲线点');
eq(gh.fields[1].bytes,32,'曲线点 32 字节');

// ---- parseLine：选项 / 标记 / 注释 ----
var p=P.parseLine('ssh-ed25519 '+GH+' alice@laptop');
eq(p.kind,'key','纯净公钥行');
eq(p.type,'ssh-ed25519','类型');
eq(p.comment,'alice@laptop','注释');
eq(p.options.length,0,'无选项');
eq(p.marker,null,'无标记');

var q=P.parseLine('command="/usr/bin/backup --to=/srv,now",no-pty,from="10.0.0.0/8,!10.1.2.3" ssh-ed25519 '+GH+' ci deploy key');
eq(q.kind,'key','带选项的行仍是 key');
eq(q.options.length,3,'引号内的逗号不参与切分');
eq(q.options[0].name,'command','选项名');
eq(q.options[0].value,'/usr/bin/backup --to=/srv,now','选项值去掉了外层引号且保留内部逗号');
eq(q.options[1].name,'no-pty','无参数选项');
eq(q.options[1].value,null,'无参数选项值为 null');
eq(q.options[2].value,'10.0.0.0/8,!10.1.2.3','from 的多值');
eq(q.comment,'ci deploy key','带空格的注释被完整保留');

var mk=P.parseLine('@cert-authority ssh-ed25519 '+GH+' ca');
eq(mk.marker,'@cert-authority','标记被识别');
eq(mk.type,'ssh-ed25519','标记后仍解析出类型');
eq(P.parseLine('').kind,'blank','空行');
eq(P.parseLine('   # 注释').kind,'comment','注释行');
eq(P.parseLine('@revoked').kind,'error','只有标记没有密钥');
eq(P.parseLine('ssh-ed25519').kind,'error','缺少密钥体');
ok(P.parseLine('hello world').error.indexOf('不像 SSH 公钥类型')>=0,'非公钥文本被拒绝');
ok(P.parseLine('command="没闭合 ssh-ed25519 AAAA').error.indexOf('双引号没有闭合')>=0,'未闭合引号被拒绝');

// ---- parseOptions 单独测 ----
var o=P.parseOptions('restrict,command="a,b",environment="X=1"');
eq(o.length,3,'三个选项');
eq(o[1].value,'a,b','引号内逗号');
eq(P.parseOptions('')[0],undefined,'空选项串');

// ---- RSA：手工构造 2048 位公钥 ----
var n2048=[0x00].concat([0xC0]).concat(fill(255,0xAB));
var rsaBlob=[].concat(S(P.utf8Bytes('ssh-rsa')), S([0x01,0x00,0x01]), S(n2048));
var rsa=P.decodeKey('ssh-rsa', P.b64encode(rsaBlob));
eq(rsa.bits,2048,'RSA 位数按 n 的有效位算，前导 0x00 不计');
eq(rsa.exponent,65537,'公钥指数');
eq(rsa.label,'RSA','RSA 标签');
var rsaIssues=P.analyze(P.parseLine('ssh-rsa '+P.b64encode(rsaBlob)), rsa).map(function(i){return i.level+':'+i.msg;}).join('\n');
ok(rsaIssues.indexOf('SHA-1 签名算法 ssh-rsa')>=0,'提醒密钥类型与签名算法是两回事');
ok(rsaIssues.indexOf('没有注释')>=0,'缺注释提示');

var weak=[].concat(S(P.utf8Bytes('ssh-rsa')), S([0x01,0x00,0x01]), S([0x00,0x80].concat(fill(127,0x11))));
var weakDec=P.decodeKey('ssh-rsa', P.b64encode(weak));
eq(weakDec.bits,1024,'1024 位 RSA');
ok(P.analyze({options:[]}, weakDec).some(function(i){ return i.level==='bad' && i.msg.indexOf('2048 位下限')>=0; }),'弱 RSA 判定为 bad');

var oddE=[].concat(S(P.utf8Bytes('ssh-rsa')), S([0x03]), S(n2048));
ok(P.analyze({options:[]}, P.decodeKey('ssh-rsa', P.b64encode(oddE))).some(function(i){ return i.msg.indexOf('e=3')>=0; }),'异常公钥指数被点名');

// ---- DSA 弃用 ----
var dsaBlob=[].concat(S(P.utf8Bytes('ssh-dss')), S([0x00,0x80].concat(fill(127,0x22))), S([0x01]), S([0x02]), S([0x03]));
var dsa=P.decodeKey('ssh-dss', P.b64encode(dsaBlob));
eq(dsa.bits,1024,'DSA 按 p 取位数');
ok(P.analyze({options:[]}, dsa).some(function(i){ return i.level==='bad' && i.msg.indexOf('9.8')>=0; }),'DSA 被判定必须替换');

// ---- ECDSA ----
var ecBlob=[].concat(S(P.utf8Bytes('ecdsa-sha2-nistp256')), S(P.utf8Bytes('nistp256')), S([0x04].concat(fill(64,0x33))));
var ec=P.decodeKey('ecdsa-sha2-nistp256', P.b64encode(ecBlob));
eq(ec.curve,'nistp256','曲线名');
eq(ec.bits,256,'P-256 位数');
eq(ec.jose,'P-256','JOSE 曲线名映射');
eq(ec.warnings.length,0,'合法未压缩点无告警');
var badPoint=[].concat(S(P.utf8Bytes('ecdsa-sha2-nistp256')), S(P.utf8Bytes('nistp256')), S([0x02].concat(fill(32,0x33))));
var bp=P.decodeKey('ecdsa-sha2-nistp256', P.b64encode(badPoint));
ok(bp.warnings.join(' ').indexOf('不是未压缩点')>=0,'压缩点被告警');
ok(bp.warnings.join(' ').indexOf('应为 65 字节')>=0,'点长度不符被告警');

// ---- 类型串行与截断 ----
var mism=P.decodeKey('ssh-rsa', GH);
ok(mism.mismatch.indexOf('串了行')>=0,'行首类型与内部类型不一致');
var trunc=P.decodeKey('ssh-ed25519', P.b64encode([0,0,0,20,1,2,3]));
ok(trunc.error.indexOf('数据不足')>=0,'截断的 wire 数据报错');
ok(P.decodeKey('ssh-ed25519','!!!!').error.indexOf('base64')>=0,'非法 base64 报错');
eq(P.decodeKey('ssh-ed25519','').error,'密钥体解出来是 0 字节','空密钥体');
var extra=P.decodeKey('ssh-ed25519', P.b64encode(P.b64decode(GH).concat([9,9,9])));
ok(extra.warnings.join(' ').indexOf('没被消费')>=0,'尾部多余字节被发现');

// ---- OpenSSH 证书 ----
var certBlob=[].concat(
  S(P.utf8Bytes('ssh-ed25519-cert-v01@openssh.com')),
  S(fill(32,0x5a)),
  S(fill(32,0x11)),
  u64(1234),
  u32(1),
  S(P.utf8Bytes('alice@corp')),
  S([].concat(S(P.utf8Bytes('alice')), S(P.utf8Bytes('root')))),
  u64(1700000000),
  u64(1700003600),
  S([]), S([]), S([]),
  S([].concat(S(P.utf8Bytes('ssh-ed25519')), S(fill(32,0x77)))),
  S(fill(64,0x99))
);
var cert=P.decodeKey('ssh-ed25519-cert-v01@openssh.com', P.b64encode(certBlob));
eq(cert.isCert,true,'识别为证书');
eq(cert.base,'ssh-ed25519','证书的底层密钥类型');
eq(cert.cert.serial,1234,'证书序列号');
eq(cert.cert.certType,'用户证书','证书用途');
eq(cert.cert.keyId,'alice@corp','key id');
eq(cert.cert.principals.join(','),'alice,root','principals 列表');
eq(cert.cert.validBefore,1700003600,'有效期终点');
eq(cert.cert.signatureKeyType,'ssh-ed25519','签发者密钥类型');
eq(cert.rest,0,'证书字段全部消费完');
var certIssues=P.analyze({options:[]}, cert).map(function(i){return i.msg;}).join('\n');
ok(certIssues.indexOf('key id="alice@corp"')>=0,'证书摘要进入体检');
var noPrin=P.decodeKey('ssh-ed25519-cert-v01@openssh.com', P.b64encode(
  [].concat(S(P.utf8Bytes('ssh-ed25519-cert-v01@openssh.com')), S(fill(32,1)), S(fill(32,2)),
   u64(1), u32(2), S(P.utf8Bytes('host')), S([]), u64(0), u64(4200000000),
   S([]), S([]), S([]), S([].concat(S(P.utf8Bytes('ssh-ed25519')), S(fill(32,3)))), S(fill(64,4)))));
eq(noPrin.cert.certType,'主机证书','主机证书类型');
var npIssues=P.analyze({options:[]}, noPrin).map(function(i){return i.level+':'+i.msg;}).join('\n');
ok(npIssues.indexOf('没有限定 principals')>=0,'空 principals 告警');
ok(npIssues.indexOf('没有实际过期时间')>=0,'超远期有效期告警');

// ---- 选项体检 ----
function lv(line){
  var pl=P.parseLine(line);
  return P.analyze(pl, P.decodeKey(pl.type, pl.b64)).map(function(i){ return i.level+':'+i.msg; }).join('\n');
}
ok(lv('command="/bin/x" ssh-ed25519 '+GH+' a').indexOf('强制命令不等于沙箱')>=0,'command 无 restrict 被警告');
ok(lv('restrict,command="/bin/x" ssh-ed25519 '+GH+' a').indexOf('强制命令不等于沙箱')<0,'restrict 后不再警告 command');
ok(lv('from="10.0.0.0/8" ssh-ed25519 '+GH+' a').indexOf('攻击面明显收窄')>=0,'from 被肯定');
ok(lv('nosuchopt ssh-ed25519 '+GH+' a').indexOf('整行拒绝')>=0,'未知选项会导致登录失败');
ok(lv('restrict,pty ssh-ed25519 '+GH+' a').indexOf('又单独放开')>=0,'restrict 后重新放开被点名');
ok(lv('restrict=1 ssh-ed25519 '+GH+' a').indexOf('不接受参数')>=0,'无参选项被塞参数');
ok(lv('from ssh-ed25519 '+GH+' a').indexOf('需要 ="值"')>=0,'有参选项缺参数');
ok(lv('ssh-ed25519 '+GH+' a').indexOf('建议至少加 restrict')>=0,'无选项时建议加 restrict');
ok(lv('no-pty ssh-ed25519 '+GH+' a').indexOf('当跳板做端口转发')>=0,'只关终端不关转发时提示跳板风险');
ok(lv('restrict ssh-ed25519 '+GH+' a').indexOf('当跳板做端口转发')<0,'restrict 后不再提示跳板风险');
ok(lv('@cert-authority ssh-ed25519 '+GH+' ca').indexOf('principals= 限定范围')>=0,'CA 行高危提示');

// ---- randomart ----
var art=P.randomart(P.sha256Bytes(P.b64decode(GH)),'ED25519 256','SHA256');
var rows=art.split('\n');
eq(rows.length,11,'randomart 共 11 行（9 行画面 + 上下边框）');
eq(rows[0].length,19,'边框宽度 19');
eq(rows[0].charAt(0),'+','上边框起始');
eq(rows[0].indexOf('[ED25519 256]')>0,true,'标题嵌在上边框里');
eq(rows[10].indexOf('[SHA256]')>0,true,'脚注嵌在下边框里');
ok(rows[5].charAt(9)!==undefined,'中心行存在');
ok(art.indexOf('S')>0,'起点 S 被标出');
ok(art.indexOf('E')>0,'终点 E 被标出');
eq(P.randomart(P.sha256Bytes(P.b64decode(GH)),'ED25519 256','SHA256'),art,'同一密钥的 randomart 稳定可复现');
ok(P.randomart(P.sha256Bytes([1,2,3]),'X 1','SHA256')!==art,'不同摘要产生不同图案');
for(var ri=1;ri<=9;ri++) eq(rows[ri].length,19,'第 '+ri+' 行宽度 19');

// ---- known_hosts ----
var kh=P.parseKnownHostsLine('github.com,140.82.121.4 ssh-ed25519 '+GH);
eq(kh.kind,'host','known_hosts 行');
eq(kh.patterns.length,2,'两个主机模式');
eq(kh.hashed,null,'明文主机名');
var hashedLine=P.hashKnownHost('github.com',[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
ok(hashedLine.indexOf('|1|')===0,'哈希主机名前缀');
var hk=P.parseKnownHostsLine(hashedLine+' ssh-ed25519 '+GH);
ok(hk.hashed!==null,'解析出哈希主机名');
eq(P.matchHashedHost(hk,'github.com'),true,'哈希主机名可反查命中');
eq(P.matchHashedHost(hk,'gitlab.com'),false,'不匹配的主机名返回 false');
eq(P.matchHashedHost(kh,'github.com'),false,'明文行不走哈希匹配');
ok(P.parseKnownHostsLine('|2|a|b ssh-ed25519 X').error.indexOf('|1|salt|hash')>=0,'不支持的哈希版本被拒绝');
eq(P.parseKnownHostsLine('onlyhost ssh-ed25519').kind,'error','known_hosts 列数不足');
eq(P.matchHostPattern('*.example.com','a.example.com'),true,'通配符匹配');
eq(P.matchHostPattern('*.example.com','example.com'),false,'通配符不越界');
eq(P.matchHostPattern('web?','web1'),true,'单字符通配');
eq(P.matchHostPattern('!bad.example.com','bad.example.com'),'deny','否定模式');

// ---- 整文件解析与统计 ----
var file=[
  '# 部署密钥',
  'restrict,from="10.0.0.0/8" ssh-ed25519 '+GH+' ci@runner',
  '',
  'ssh-ed25519 '+GH+' 重复的同一把钥匙',
  'ssh-dss '+P.b64encode(dsaBlob)+' legacy',
  '这一行是垃圾'
].join('\n');
var entries=P.parseFile(file);
eq(entries.length,6,'逐行解析');
eq(entries[0].kind,'comment','第 1 行注释');
eq(entries[1].line,2,'行号从 1 开始');
eq(entries[5].kind,'error','垃圾行标记为 error');
var st=P.fileStats(entries);
eq(st.total,3,'三条密钥');
eq(st.byType['Ed25519'],2,'两把 Ed25519');
eq(st.dupes.length,1,'检出一处重复');
eq(st.dupes[0].lines.join('-'),'2-4','重复出现在第 2 行与第 4 行');
eq(st.errors,1,'一条错误行');
eq(st.weakest.label,'DSA','最弱的是 DSA');

// ---- buildLine ----
eq(P.buildLine(['restrict','from="1.2.3.4"'],'ssh-ed25519','AAAA','bot@ci'),
   'restrict,from="1.2.3.4" ssh-ed25519 AAAA bot@ci','拼装 authorized_keys 行');
eq(P.buildLine([],'ssh-ed25519','AAAA',''),'ssh-ed25519 AAAA','无选项无注释');
eq(P.buildLine(['',null],'ssh-rsa','BBBB','x'),'ssh-rsa BBBB x','空选项被过滤');
var round=P.parseLine(P.buildLine(['restrict','command="a,b"'],'ssh-ed25519',GH,'k'));
eq(round.options.length,2,'拼装后再解析仍是两个选项');
eq(round.options[1].value,'a,b','往返后引号内逗号无损');

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
process.exit(fail?1:0);
