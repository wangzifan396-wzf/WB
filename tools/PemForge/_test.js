const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }

// ---- base64 ----
ok(P.b64encode([77,97,110])==='TWFu', 'b64 encode 3 bytes');
ok(P.b64encode([77,97])==='TWE=', 'b64 encode 2 bytes pad');
ok(P.b64encode([77])==='TQ==', 'b64 encode 1 byte pad');
ok(P.b64encode([])==='', 'b64 encode empty');
ok(eq(P.b64decode('TWFu'),[77,97,110]), 'b64 decode');
ok(eq(P.b64decode('TWE='),[77,97]), 'b64 decode pad1');
ok(eq(P.b64decode('TQ=='),[77]), 'b64 decode pad2');
ok(eq(P.b64decode('TW\nFu'),[77,97,110]), 'b64 decode ignores newlines');
ok(eq(P.b64decode('TWFu-_'.slice(0,4)),[77,97,110]), 'b64 url-safe tolerated');
var threwB64=false; try{ P.b64decode('@@@@'); }catch(e){ threwB64=true; }
ok(threwB64, 'b64 rejects illegal chars');
var rt=[0,1,2,250,255,128,64];
ok(eq(P.b64decode(P.b64encode(rt)), rt), 'b64 round trip');

// ---- hex ----
ok(P.bytesToHex([0,15,255])==='000fff', 'bytesToHex');
ok(P.bytesToHex([1,2],':')==='01:02', 'bytesToHex separator');
ok(eq(P.hexToBytes('00:0f:ff'),[0,15,255]), 'hexToBytes with separators');
ok(eq(P.hexToBytes('fff'),[15,255]), 'hexToBytes odd length pads');

// ---- PEM ----
var pem=P.pemEncode('CERTIFICATE',[1,2,3]);
ok(pem.indexOf('-----BEGIN CERTIFICATE-----')===0, 'pem header');
ok(pem.indexOf('-----END CERTIFICATE-----')>0, 'pem footer');
var long=P.pemEncode('X', new Array(200).join('a').split('').map(function(){return 65;}));
ok(long.split('\n').slice(1,-1).every(function(l){ return l.length<=64; }), 'pem wraps at 64 chars');
var dec=P.pemDecode(pem);
ok(dec.length===1 && dec[0].label==='CERTIFICATE' && eq(dec[0].bytes,[1,2,3]), 'pem round trip');
var multi=P.pemDecode(P.pemEncode('CERTIFICATE',[1])+'\n'+P.pemEncode('PRIVATE KEY',[2]));
ok(multi.length===2 && multi[1].label==='PRIVATE KEY', 'pem multi-block');
ok(P.pemDecode('30 03 02 01 05')[0].label==='RAW HEX', 'raw hex fallback');
ok(P.pemDecode('MAMCAQU=')[0].label==='RAW BASE64', 'raw base64 fallback');
var threwPem=false; try{ P.pemDecode('中文中文'); }catch(e){ threwPem=true; }
ok(threwPem, 'pemDecode rejects garbage');

// ---- OID ----
ok(P.oidToString([42,134,72,134,247,13,1,1,11])==='1.2.840.113549.1.1.11', 'oid decode rsa-sha256');
ok(P.oidToString([85,4,3])==='2.5.4.3', 'oid decode CN');
ok(P.oidToString([43,101,112])==='1.3.101.112', 'oid decode ed25519');
ok(eq(P.oidEncode('1.2.840.113549.1.1.11'),[42,134,72,134,247,13,1,1,11]), 'oid encode');
ok(eq(P.oidEncode('2.5.4.3'),[85,4,3]), 'oid encode CN');
ok(P.oidToString(P.oidEncode('1.3.6.1.4.1.11129.2.4.2'))==='1.3.6.1.4.1.11129.2.4.2', 'oid round trip large arc');
ok(P.oidName('1.2.840.113549.1.1.11')==='sha256WithRSAEncryption', 'oid name lookup');
ok(P.oidName('9.9.9')==='9.9.9', 'unknown oid passthrough');

// ---- integers ----
ok(P.decodeInt([5])===5, 'int 5');
ok(P.decodeInt([0xff])===-1, 'int -1');
ok(P.decodeInt([0x01,0x00])===256, 'int 256');
ok(P.decodeInt([0x00,0xff])===255, 'int leading zero');
ok(eq(P.encodeInt(5),[5]), 'encode 5');
ok(eq(P.encodeInt(128),[0,128]), 'encode 128 adds zero pad');
ok(eq(P.encodeInt(-1),[0xff]), 'encode -1');
ok(eq(P.encodeInt(0),[0]), 'encode 0');
ok(P.decodeInt(P.encodeInt(65537))===65537, 'int round trip 65537');
ok(P.decodeInt(P.encodeInt(-300))===-300, 'int round trip negative');
ok(String(P.decodeInt([1,2,3,4,5,6,7])).indexOf('0x')===0, 'huge int -> hex string');

// ---- strings ----
ok(P.decodeString([104,105])==='hi', 'ascii decode');
ok(P.decodeString(P.encodeString('nano 工具'))==='nano 工具', 'utf8 round trip');
ok(P.encodeString('A').length===1 && P.encodeString('中').length===3, 'utf8 byte widths');

// ---- length encoding ----
ok(eq(P.encodeLength(5),[5]), 'short length');
ok(eq(P.encodeLength(200),[0x81,200]), 'long length 1 byte');
ok(eq(P.encodeLength(300),[0x82,1,44]), 'long length 2 bytes');

// ---- tag names ----
ok(P.tagName(0x30)==='SEQUENCE', 'tag SEQUENCE');
ok(P.tagName(0x02)==='INTEGER', 'tag INTEGER');
ok(P.tagName(0x06)==='OBJECT IDENTIFIER', 'tag OID');
ok(P.tagName(0xa0)==='[0]', 'tag context 0');
ok(P.tagName(0x82)==='[2]', 'tag context 2');

// ---- DER parse/encode ----
var simple=[0x30,0x05,0x02,0x01,0x05,0x05,0x00];
var node=P.derParse(simple);
ok(node.tagName==='SEQUENCE' && node.children.length===2, 'parse sequence');
ok(node.children[0].value===5, 'parse integer child');
ok(node.children[1].value===null, 'parse null child');
ok(node.headerLen===2 && node.length===5, 'parse header/length');
ok(eq(P.derEncode({tag:0x30,children:[{tag:0x02,bytes:[5]},{tag:0x05,bytes:[]}]}), [0x30,0x05,0x02,0x01,0x05,0x05,0x00]), 'der encode sequence');

var B=P.B;
var built=P.derEncode(B.seq([B.int(42), B.oid('1.2.840.113549.1.1.1'), B.utf8('nano'), B.bool(true), B.nul()]));
var reparsed=P.derParse(built);
ok(reparsed.children.length===5, 'builder produces 5 children');
ok(reparsed.children[0].value===42, 'builder int');
ok(reparsed.children[1].value==='rsaEncryption', 'builder oid resolves name');
ok(reparsed.children[2].value==='nano', 'builder utf8');
ok(reparsed.children[3].value===true, 'builder bool');
ok(eq(P.derEncode(reparsed), built), 'der parse->encode is byte identical');

// ---- parse errors ----
function throws(fn){ try{ fn(); return false; }catch(e){ return true; } }
ok(throws(function(){ P.derParse([0x30,0x10,0x02]); }), 'truncated content throws');
ok(throws(function(){ P.derParse([0x30,0x80,0x00,0x00]); }), 'indefinite length rejected');
ok(throws(function(){ P.derParse([0x1f,0x01,0x00]); }), 'long-form tag rejected');
ok(throws(function(){ P.derParse([]); }), 'empty buffer throws');
ok(throws(function(){ P.derParse([0x30]); }), 'missing length throws');

// ---- time ----
ok(P.parseTime(23, P.encodeString('260101000000Z'))==='2026-01-01T00:00:00Z', 'UTCTime 2026');
ok(P.parseTime(23, P.encodeString('490101000000Z'))==='2049-01-01T00:00:00Z', 'UTCTime <50 -> 20xx');
ok(P.parseTime(23, P.encodeString('990101000000Z'))==='1999-01-01T00:00:00Z', 'UTCTime >=50 -> 19xx');
ok(P.parseTime(24, P.encodeString('20301231235959Z'))==='2030-12-31T23:59:59Z', 'GeneralizedTime');

// ---- name ----
var nameNode=P.derParse(P.derEncode(B.seq([B.rdn('2.5.4.3','example.com'), B.rdn('2.5.4.10','Acme')])));
ok(P.nameToString(nameNode)==='CN=example.com, O=Acme', 'nameToString');
ok(P.nameToString(null)==='', 'nameToString null safe');

// ---- rsaKeyBits ----
ok(P.rsaKeyBits({bytes:[0x00,0xff,0xff]})===16, 'rsaKeyBits strips leading zero');
ok(P.rsaKeyBits({bytes:[0x01,0x00]})===9, 'rsaKeyBits counts leading zero bits');
ok(P.rsaKeyBits(null)===0, 'rsaKeyBits null safe');

// ---- certificate ----
var der=P.demoCertificate();
var cert=P.parseCertificate(der);
ok(cert.kind==='certificate', 'demo cert kind');
ok(cert.version===3, 'demo cert v3');
ok(cert.subject.indexOf('CN=pemforge.local')>=0, 'demo cert subject CN');
ok(cert.issuer.indexOf('nano-tools Demo CA')>=0, 'demo cert issuer');
ok(cert.notBefore==='2026-01-01T00:00:00Z', 'demo cert notBefore');
ok(cert.notAfter==='2027-01-01T00:00:00Z', 'demo cert notAfter');
ok(cert.signatureAlgorithm==='sha256WithRSAEncryption', 'demo cert sig alg');
ok(cert.publicKeyAlgorithm==='rsaEncryption', 'demo cert key alg');
ok(cert.exponent===65537, 'demo cert exponent');
ok(cert.keyBits>0, 'demo cert key bits parsed');
ok(cert.selfSigned===false, 'demo cert not self-signed');
ok(cert.extensions.length===3, 'demo cert 3 extensions');
ok(cert.extensions.some(function(e){ return e.oid==='subjectAltName'; }), 'demo cert has SAN');
ok(cert.extensions[0].critical===true, 'basicConstraints critical');
ok(eq(P.derEncode(P.derParse(der)), der), 'demo cert der round trip');

// ---- inspect ----
var res=P.inspect(P.demoPem(), Date.parse('2026-06-01T00:00:00Z'));
ok(res.length===1 && res[0].label==='CERTIFICATE', 'inspect finds one block');
ok(res[0].info.kind==='certificate', 'inspect classifies certificate');
ok(res[0].tree && res[0].tree.tagName==='SEQUENCE', 'inspect builds tree');
ok(res[0].error==null, 'inspect no error');
var lines=P.treeLines(res[0].tree);
ok(lines.length>15, 'treeLines expands nodes');
ok(lines[0].indent===0 && lines[1].indent===1, 'treeLines indents children');
ok(lines.some(function(l){ return l.text.indexOf('OBJECT IDENTIFIER')>=0; }), 'treeLines shows OIDs');

// ---- lint ----
var l1=P.lint({kind:'certificate', signatureAlgorithm:'sha1WithRSAEncryption', version:3, extensions:[{oid:'subjectAltName'}]});
ok(l1.some(function(x){ return x.level==='error' && x.msg.indexOf('sha1')>=0; }), 'lint sha1 rejected');
var l2=P.lint({kind:'certificate', publicKeyAlgorithm:'rsaEncryption', keyBits:1024, version:3, extensions:[{oid:'subjectAltName'}]});
ok(l2.some(function(x){ return x.msg.indexOf('1024')>=0; }), 'lint weak rsa');
var l3=P.lint({kind:'certificate', publicKeyAlgorithm:'rsaEncryption', keyBits:2048, exponent:3, version:3, extensions:[{oid:'subjectAltName'}]});
ok(l3.some(function(x){ return x.msg.indexOf('65537')>=0; }), 'lint odd exponent');
var l4=P.lint({kind:'certificate', version:3, notBefore:'2020-01-01T00:00:00Z', notAfter:'2024-01-01T00:00:00Z', extensions:[{oid:'subjectAltName'}]},
  Date.parse('2026-01-01T00:00:00Z'));
ok(l4.some(function(x){ return x.msg.indexOf('已过期')>=0; }), 'lint expired');
ok(l4.some(function(x){ return x.msg.indexOf('398')>=0; }), 'lint over 398 days');
var l5=P.lint({kind:'certificate', version:3, notBefore:'2030-01-01T00:00:00Z', notAfter:'2030-06-01T00:00:00Z', extensions:[{oid:'subjectAltName'}]},
  Date.parse('2026-01-01T00:00:00Z'));
ok(l5.some(function(x){ return x.msg.indexOf('尚未生效')>=0; }), 'lint not yet valid');
var l6=P.lint({kind:'certificate', version:3, notBefore:'2026-01-01T00:00:00Z', notAfter:'2026-01-20T00:00:00Z', extensions:[{oid:'subjectAltName'}]},
  Date.parse('2026-01-10T00:00:00Z'));
ok(l6.some(function(x){ return x.msg.indexOf('剩')>=0; }), 'lint expiring soon');
ok(P.lint({kind:'certificate', version:1, extensions:[]}).some(function(x){ return x.msg.indexOf('v1')>=0; }), 'lint v1 warning');
ok(P.lint({kind:'certificate', version:3, extensions:[]}).some(function(x){ return x.msg.indexOf('X.509 扩展')>=0; }), 'lint no extensions');
ok(P.lint({kind:'certificate', version:3, extensions:[{oid:'keyUsage'}]}).some(function(x){ return x.msg.indexOf('subjectAltName')>=0; }), 'lint missing SAN');
ok(P.lint({kind:'private-key', encrypted:false}).some(function(x){ return x.msg.indexOf('未加密的私钥')>=0; }), 'lint plaintext private key');
ok(P.lint({kind:'private-key', encrypted:true}).some(function(x){ return x.msg.indexOf('加密的私钥')>=0; }), 'lint encrypted key note');
ok(P.lint({kind:'certificate', version:3, selfSigned:true, extensions:[{oid:'subjectAltName'}]}).some(function(x){ return x.msg.indexOf('自签名')>=0; }), 'lint self-signed');
ok(P.lint(null).length===0, 'lint null safe');

// ---- keys ----
var rsaPubDer=P.derEncode(B.seq([B.bigint('C0'+new Array(64).join('AB')), B.int(65537)]));
var kinfo=P.parseKey('RSA PUBLIC KEY', rsaPubDer);
ok(kinfo.kind==='public-key' && kinfo.exponent===65537, 'parse pkcs1 rsa public key');
ok(kinfo.keyBits>0, 'pkcs1 key bits');
var spkiDer=P.derEncode(B.seq([B.seq([B.oid('1.2.840.10045.2.1'), B.oid('1.2.840.10045.3.1.7')]), B.bits([4,1,2,3],0)]));
var eck=P.parseKey('PUBLIC KEY', spkiDer);
ok(eck.publicKeyAlgorithm==='id-ecPublicKey', 'parse ec spki alg');
ok(eck.curve==='prime256v1 (P-256)', 'parse ec curve');
var encKey=P.parseKey('ENCRYPTED PRIVATE KEY', P.derEncode(B.seq([B.int(0)])));
ok(encKey.encrypted===true, 'encrypted private key flagged');

// ---- csr ----
var csrDer=P.derEncode(B.seq([
  B.seq([B.int(0), B.seq([B.rdn('2.5.4.3','csr.example')]),
         B.seq([B.seq([B.oid('1.2.840.113549.1.1.1'), B.nul()]), B.bits(P.derEncode(B.seq([B.bigint('C0AB'), B.int(65537)])),0)])]),
  B.seq([B.oid('1.2.840.113549.1.1.11'), B.nul()]),
  B.bits([1,2,3],0)]));
var csr=P.parseCsr(csrDer);
ok(csr.kind==='csr' && csr.subject==='CN=csr.example', 'parse csr subject');
ok(csr.signatureAlgorithm==='sha256WithRSAEncryption', 'parse csr sig alg');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
