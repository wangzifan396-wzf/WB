const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

ok(P.ymlScalar('42')===42, 'yaml scalar parses integer');
ok(P.ymlScalar('true')===true, 'yaml scalar parses boolean');
ok(P.ymlScalar("'hi'")==='hi', 'yaml scalar unquotes single quotes');
ok(P.ymlScalar('~')===null, 'tilde is null');
ok(JSON.stringify(P.ymlScalar('[a, b]'))==='["a","b"]', 'inline flow sequence parsed');
const kv=P.splitKV('name: value');
ok(kv.key==='name' && kv.val==='value', 'splitKV separates key and value');
ok(P.splitKV('parent:').val==='', 'splitKV handles empty value');
ok(P.splitKV('https://x')===null, 'splitKV ignores colon without space');

const y=P.parseYaml('a: 1\nb:\n  c: two\nlist:\n  - x\n  - y\n');
ok(y.error===null, 'simple yaml parses without error');
ok(y.value.a===1 && y.value.b.c==='two', 'nested mapping parsed');
ok(Array.isArray(y.value.list) && y.value.list.length===2, 'sequence parsed');
const y2=P.parseYaml('items:\n- name: a\n  in: query\n- name: b\n  in: path\n');
ok(y2.value.items.length===2, 'dash-at-same-indent sequence parsed');
ok(y2.value.items[0].name==='a' && y2.value.items[0]['in']==='query', 'inline dash map absorbs sibling keys');
ok(y2.value.items[1]['in']==='path', 'second sequence item parsed');
ok(P.parseYaml('# only a comment\n').error!==null, 'comment-only input errors');

const SPEC='openapi: 3.0.3\ninfo:\n  title: T\n  version: 1.0.0\nservers:\n  - url: https://api.x/v1\npaths:\n  /a:\n    get:\n      operationId: getA\n      summary: s\n      tags: [t]\n      responses:\n        \'200\':\n          description: OK\n        \'404\':\n          description: NF\n';
const ps=P.parseSpec(SPEC);
ok(ps.error===null && ps.format==='yaml', 'yaml spec parsed');
const info=P.specInfo(ps.spec);
ok(info.title==='T' && info.apiVersion==='1.0.0', 'specInfo reads title and version');
ok(info.baseUrl==='https://api.x/v1', 'specInfo reads first server url');
ok(info.paths===1, 'specInfo counts paths');
ok(P.parseSpec('{"openapi":"3.0.0"}').format==='json', 'json spec detected');
ok(P.parseSpec('{bad json').error!==null, 'broken json reports error');
ok(P.parseSpec('   ').error!==null, 'empty input reports error');

const ops=P.listOperations(ps.spec);
ok(ops.length===1 && ops[0].method==='GET', 'listOperations finds the GET operation');
ok(ops[0].codes.join(',')==='200,404', 'response codes collected and sorted');
ok(JSON.stringify(P.pathParams('/a/{id}/b/{sub}'))==='["id","sub"]', 'pathParams extracts placeholders');

const lint=P.lintSpec(ps.spec);
ok(lint.bad===0, 'clean spec has no blocking issues');
ok(lint.grade==='A'||lint.grade==='B', 'clean spec grades well');
const bad=P.parseSpec('paths:\n  /x/{id}:\n    post:\n      responses:\n        \'500\':\n          description: E\n').spec;
const lb=P.lintSpec(bad);
ok(lb.issues.some(function(i){return /openapi 版本/.test(i.msg);}), 'missing openapi version flagged');
ok(lb.issues.some(function(i){return /未在 parameters 中声明/.test(i.msg);}), 'undeclared path parameter flagged');
ok(lb.issues.some(function(i){return /2xx/.test(i.msg);}), 'missing 2xx flagged');
ok(lb.issues.some(function(i){return /requestBody/.test(i.msg);}), 'POST without requestBody flagged');
ok(lb.score<lint.score, 'broken spec scores lower than clean spec');
const verb=P.lintSpec(P.parseSpec('openapi: 3.0.0\npaths:\n  /getUser:\n    get:\n      responses:\n        \'200\':\n          description: OK\n').spec);
ok(verb.issues.some(function(i){return /动词/.test(i.msg);}), 'verb in path flagged');
const dup=P.lintSpec(P.parseSpec('openapi: 3.0.0\npaths:\n  /a:\n    get:\n      operationId: x\n      responses:\n        \'200\':\n          description: OK\n  /b:\n    get:\n      operationId: x\n      responses:\n        \'200\':\n          description: OK\n').spec);
ok(dup.issues.some(function(i){return /重复/.test(i.msg);}), 'duplicate operationId flagged');
ok(P.gradeOf(95)==='A' && P.gradeOf(10)==='F', 'grade thresholds');

const cov=P.coverage(ps.spec);
ok(cov.total===1 && cov.opId===100 && cov.errors===100, 'coverage computed from operations');
ok(P.coverage({}).total===0, 'coverage on empty spec is zero');

const c=P.curlFor(ops[0], info.baseUrl);
ok(c.indexOf("curl -sS -X GET 'https://api.x/v1/a'")===0, 'curl built from operation and base url');
const withPath=P.listOperations(P.parseSpec('openapi: 3.0.0\npaths:\n  /u/{id}:\n    get:\n      parameters:\n        - name: id\n          in: path\n      responses:\n        \'200\':\n          description: OK\n').spec)[0];
ok(P.curlFor(withPath,'').indexOf('/u/<id>')>0, 'path params rendered as placeholders in curl');
const tg=P.tagSummary(ps.spec);
ok(tg.length===1 && tg[0].tag==='t' && tg[0].count===1, 'tagSummary groups operations');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
