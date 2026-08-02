
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }
ok(Array.isArray(P.DB) && P.DB.length>=30, 'DB 含 >=30 条命令 (got '+(P.DB&&P.DB.length)+')');
ok(P.search('').length===P.DB.length, '空查询返回全部');
ok(P.search('git').some(function(e){return e.name==='git';}), '搜 git 命中 git');
eq(P.search('zzz').length, 0, '乱码查询返回空');
ok(P.search('docker').some(function(e){return e.name==='docker';}), '搜 docker 命中');
var d=P.get('docker'); ok(d && d.examples.length>=3, 'docker 至少 3 条示例');
ok(P.search('ssh').some(function(e){return e.name==='ssh';}), '按关键词 ssh 命中');
var cs=P.cats(); ok(Object.keys(cs).length>=5, '分类 >=5 (got '+Object.keys(cs).length+')');
ok(P.get('git').examples.some(function(x){return /clone/.test(x.c);}), 'git 含 clone 示例');
ok(P.get('rsync').examples.length>=5, 'rsync 含多条示例');
console.log((fail?'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
if(fail) process.exit(1);
