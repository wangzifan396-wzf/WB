
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var mp=A.modelProfile('代码增强');
ok('model', mp.model==='代码增强型' && mp.maxTokens==='8K');
var tp=A.tempProfile('精确');
ok('temp', tp.temp==='0.2');
ok('memkey', A.memoryKey('长期记忆（RAG）')==='long-term-rag' && A.memoryKey('短期记忆')==='session' && A.memoryKey('')==='none');
var a=A.buildAgentSpec({name:'DocsHelper',role:'文档问答',kind:'通用对话',temp:'平衡',tools:'知识库检索\n文档摘要',memory:'长期记忆',constraints:'只引用知识库内容'});
ok('full', a.toolCount===2 && a.temperature==='0.7' && a.memory==='long-term-rag');
ok('yaml', a.markdown.indexOf('```yaml')>=0 && a.markdown.indexOf('name: "DocsHelper"')>=0 && a.markdown.indexOf('temperature: 0.7')>=0 && a.markdown.indexOf('memory: "long-term-rag"')>=0);
ok('sections', a.markdown.indexOf('角色定位')>=0 && a.markdown.indexOf('工具能力')>=0 && a.markdown.indexOf('记忆策略')>=0 && a.markdown.indexOf('约束与安全')>=0);
ok('rag', a.markdown.indexOf('RAG 检索')>=0);
var b=A.buildAgentSpec({});
ok('empty', b.markdown.indexOf('UnnamedAgent')>=0 && b.markdown.indexOf('（待补充角色定位）')>=0 && b.toolCount===0 && b.markdown.indexOf('（无外部工具，纯对话能力）')>=0);
ok('defaults', b.markdown.indexOf('不得编造')>=0 && b.temperature==='0.7');
console.log('AiAgentSpecForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
