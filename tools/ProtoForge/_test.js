const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

ok(P.stripComments('a // c\nb')==='a \nb', 'line comments stripped');
ok(P.stripComments('a /* x */ b').indexOf('x')<0, 'block comments stripped');
ok(P.stripComments('s = "http://x"; // t').indexOf('http://x')>0, 'url inside string survives comment stripping');

ok(P.wireTypeOf('int32')===0, 'int32 is varint');
ok(P.wireTypeOf('double')===1, 'double is 64-bit');
ok(P.wireTypeOf('string')===2, 'string is length-delimited');
ok(P.wireTypeOf('float')===5, 'float is 32-bit');
ok(P.wireTypeOf('MyMessage')===2, 'messages are length-delimited');
ok(P.tagBytes(1)===1 && P.tagBytes(15)===1, 'fields 1-15 use one tag byte');
ok(P.tagBytes(16)===2 && P.tagBytes(2047)===2, 'fields 16-2047 use two tag bytes');
ok(P.tagBytes(2048)===3, 'field 2048 needs three tag bytes');
ok(P.tagBytes(0)===0, 'invalid field number yields zero');

const SRC='syntax = "proto3";\npackage a.b;\nimport "x.proto";\nenum E { E_ZERO = 0; E_ONE = 1; }\nmessage M {\n  string id = 1;\n  repeated int32 nums = 2;\n  map<string, int64> tags = 3;\n  E kind = 4;\n}\nservice S {\n  rpc Get(M) returns (M);\n  rpc Watch(M) returns (stream M);\n}\n';
const r=P.parseProto(SRC);
ok(r.syntax==='proto3', 'syntax parsed');
ok(r.pkg==='a.b', 'package parsed');
ok(r.imports.length===1 && r.imports[0]==='x.proto', 'imports parsed');
ok(r.messages.length===1 && r.messages[0].name==='M', 'message parsed');
ok(r.messages[0].fields.length===4, 'all four fields parsed');
ok(r.messages[0].fields[1].repeated===true, 'repeated label detected');
ok(r.messages[0].fields[2].label==='map' && r.messages[0].fields[2].keyType==='string', 'map field parsed');
ok(r.enums.length===1 && r.enums[0].values.length===2, 'enum with two values parsed');
ok(r.services.length===1 && r.services[0].rpcs.length===2, 'service rpcs parsed');
ok(r.services[0].rpcs[1].serverStream===true, 'server streaming rpc detected');
ok(r.errors.length===0, 'clean proto has no unparsed statements');

const rows=P.fieldRows(r.messages[0]);
ok(rows[0].wireName==='Length-delimited', 'string field wire name');
ok(rows[0].scalar===true && rows[3].scalar===false, 'scalar flag distinguishes enum reference');
ok(P.tsTypeOf(r.messages[0].fields[0])==='string', 'string maps to TS string');
ok(P.tsTypeOf(r.messages[0].fields[1])==='number[]', 'repeated int32 maps to number[]');
ok(P.tsTypeOf(r.messages[0].fields[2])==='Record<string, string>', 'map<string,int64> maps to Record with string value');
const ts=P.toTypeScript(r);
ok(ts.indexOf('export interface M {')>=0, 'TypeScript interface emitted');
ok(ts.indexOf('export enum E {')>=0, 'TypeScript enum emitted');
ok(ts.indexOf('id?: string;')>0, 'proto3 singular fields are optional in TS');

const lint=P.lintProto(r);
ok(lint.bad===0, 'clean proto has no blocking issues');
const dup=P.lintProto(P.parseProto('syntax = "proto3";\nmessage M { string a = 1; string b = 1; }\n'));
ok(dup.issues.some(function(i){return /重复/.test(i.msg);}), 'duplicate field number flagged');
const resv=P.lintProto(P.parseProto('syntax = "proto3";\nmessage M { string a = 19001; }\n'));
ok(resv.issues.some(function(i){return /保留区/.test(i.msg);}), 'reserved range 19000-19999 flagged');
const req=P.lintProto(P.parseProto('syntax = "proto3";\nmessage M { required string a = 1; }\n'));
ok(req.issues.some(function(i){return /required/.test(i.msg);}), 'required in proto3 flagged');
const enz=P.lintProto(P.parseProto('syntax = "proto3";\nenum E { E_ONE = 1; }\n'));
ok(enz.issues.some(function(i){return /必须为 0/.test(i.msg);}), 'proto3 enum must start at zero');
const money=P.lintProto(P.parseProto('syntax = "proto3";\nmessage M { double price = 1; }\n'));
ok(money.issues.some(function(i){return /精度/.test(i.msg);}), 'float money field flagged');
const camel=P.lintProto(P.parseProto('syntax = "proto3";\nmessage M { string userName = 1; }\n'));
ok(camel.issues.some(function(i){return /snake_case/.test(i.msg);}), 'camelCase field name flagged');
const gap=P.lintProto(P.parseProto('syntax = "proto3";\nmessage M { string a = 1; string b = 5; }\n'));
ok(gap.issues.some(function(i){return /空洞/.test(i.msg);}), 'field number gap without reserved flagged');
ok(P.lintProto(P.parseProto('message M { string a = 1; }')).issues.some(function(i){return /syntax/.test(i.msg);}), 'missing syntax flagged');

const st=P.stats(r);
ok(st.messages===1 && st.fields===4 && st.rpcs===2, 'stats aggregate counts');
ok(st.imports===1, 'stats count imports');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
