const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

// id
ok(P.sanitizeRuleId('100001')===100001, 'id parsed');
ok(P.sanitizeRuleId('1a2b3')===123, 'id strips non-digits');
ok(P.sanitizeRuleId('0')===null, 'id 0 invalid');
ok(P.sanitizeRuleId('1000000')===null, 'id over 999999 invalid');
ok(P.sanitizeRuleId('abc')===null, 'id non-numeric invalid');

// buildSecRule
var r1=P.buildSecRule({id:'100001',variable:'ARGS',operator:'detectSQLi',phase:2,action:'block',transforms:['lowercase'],msg:'SQLi',severity:'CRITICAL'});
ok(r1.error===null, 'valid rule builds');
ok(/^SecRule ARGS "@detectSQLi"/.test(r1.value), 'SecRule variable + operator');
ok(/id:100001/.test(r1.value), 'rule has id');
ok(/phase:2/.test(r1.value), 'rule has phase');
ok(/deny,status:403/.test(r1.value), 'block -> deny,status:403');
ok(/t:lowercase/.test(r1.value), 'transform emitted');
ok(/msg:'SQLi'/.test(r1.value), 'msg emitted');
ok(/severity:CRITICAL/.test(r1.value), 'severity emitted');

var allowR=P.buildSecRule({id:'1',variable:'REMOTE_ADDR',operator:'@ipMatch 1.2.3.4',phase:1,action:'allow'});
ok(/allow/.test(allowR.value) && !/deny/.test(allowR.value), 'allow action emitted');

ok(P.buildSecRule({id:'x'}).error!==null, 'bad id errors');
ok(P.buildSecRule({id:'1',phase:9}).error!==null, 'bad phase errors');
ok(P.buildSecRule({id:'1',variable:'',operator:'x',phase:1}).error!==null, 'missing variable errors');
ok(P.buildSecRule({id:'1',variable:'X',operator:'',phase:1}).error!==null, 'missing operator errors');
ok(/@detectSQLi/.test(P.buildSecRule({id:'1',variable:'X',operator:'detectSQLi',phase:1}).value), 'operator normalized with @');

// buildPolicy
var pol=P.buildPolicy({id:'100001',variable:'ARGS',operator:'detectXSS',phase:2,action:'block',msg:'x'});
ok(pol.error===null, 'policy builds');
ok(pol.value.engine==='modsecurity-v3', 'policy engine');
ok(pol.value.rule.id===100001, 'policy rule id');
ok(pol.value.rule.operator==='detectXSS', 'policy operator preserved');
ok(P.buildPolicy({id:'bad'}).error!==null, 'policy bad id errors');

// lint
ok(P.lintRule({id:'100001',variable:'ARGS',operator:'detectSQLi',phase:2,action:'block'}).issues.length===0, 'lint clean rule');
ok(P.lintRule({id:'x'}).issues.some(function(i){return /id/.test(i.msg);}), 'lint flags bad id');
ok(P.lintRule({id:'1',variable:'',operator:'x',phase:1}).issues.some(function(i){return /variable/.test(i.msg);}), 'lint flags missing variable');
ok(P.lintRule({id:'1',variable:'X',operator:'x',phase:9}).issues.some(function(i){return /phase/.test(i.msg);}), 'lint flags bad phase');
ok(P.lintRule({id:'1',variable:'X',operator:'x',phase:1,action:'weird'}).issues.length>0, 'lint warns on odd action');
ok(P.lintRule({id:'100001',variable:'ARGS',operator:'detectSQLi',phase:2,action:'block'}).score===100, 'clean rule 100');

// templates
ok(P.templates().length>=7, 'template library populated');
ok(P.templates().some(function(t){return t.name==='SQL 注入 (CRS)';}), 'SQLi template present');
ok(P.templates().every(function(t){return P.sanitizeRuleId(t.id)!==null && t.phase>=1 && t.phase<=5;}), 'all templates valid');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
