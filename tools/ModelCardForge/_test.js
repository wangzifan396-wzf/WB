
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var kv=A.parseKV('准确率: 0.92\n延迟：200ms\n无冒号行');
ok('kv', kv.length===3 && kv[0].k==='准确率' && kv[0].v==='0.92' && kv[1].k==='延迟' && kv[1].v==='200ms');
var a=A.buildModelCard({name:'DocQA',type:'文本生成',version:'1.0',summary:'内部问答',uses:'知识库问答\n文档摘要',metrics:'准确率: 0.92\n平均延迟(ms): 200',limits:'长文档丢上下文\n易幻觉',ethics:'训练数据脱敏',license:'Apache-2.0'});
ok('full', a.metricCount===2 && a.useCount===2 && a.title.indexOf('DocQA')>=0 && a.markdown.indexOf('文本生成')>=0 && a.markdown.indexOf('Apache-2.0')>=0);
ok('table', a.markdown.indexOf('| 指标 | 数值 |')>=0 && a.markdown.indexOf('| 准确率 | 0.92 |')>=0 && a.markdown.indexOf('| 平均延迟(ms) | 200 |')>=0);
ok('sections', a.markdown.indexOf('预期用途')>=0 && a.markdown.indexOf('伦理与安全')>=0 && a.markdown.indexOf('已知局限')>=0 && a.markdown.indexOf('许可证')>=0);
ok('ethics', a.markdown.indexOf('训练数据脱敏')>=0);
var b=A.buildModelCard({});
ok('empty', b.markdown.indexOf('UnnamedModel')>=0 && b.useCount===1 && b.metricCount===0 && b.markdown.indexOf('（待补充预期用途）')>=0 && b.markdown.indexOf('（暂无指标')>=0);
ok('defaultEthics', b.markdown.indexOf('数据来源需合规')>=0);
console.log('ModelCardForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
