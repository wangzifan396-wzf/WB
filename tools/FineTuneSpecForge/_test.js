
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildFineTuneSpec({name:'ZH-Summary-FT',base:'Qwen2.5-7B',method:'LoRA',task:'中文长文摘要',dataDesc:'摘要对',dataSize:'50k',epochs:'3',lr:'2e-5',batchSize:'8',hardware:'A100',metric:'ROUGE-L',notes:'不捏造\n保通用'});
ok('full', a.epochs===3 && a.batchSize===8 && a.hasNotes===true && a.title.indexOf('ZH-Summary-FT')>=0 && a.markdown.indexOf('Qwen2.5-7B')>=0 && a.markdown.indexOf('LoRA')>=0 && a.markdown.indexOf('ROUGE-L')>=0);
ok('sections', a.markdown.indexOf('目标与任务')>=0 && a.markdown.indexOf('基模与方法')>=0 && a.markdown.indexOf('数据与预处理')>=0 && a.markdown.indexOf('训练超参')>=0 && a.markdown.indexOf('资源与环境')>=0 && a.markdown.indexOf('评估')>=0 && a.markdown.indexOf('风险与回滚')>=0);
ok('hyper', a.markdown.indexOf('epochs：3')>=0 && a.markdown.indexOf('lr：2e-5')>=0 && a.markdown.indexOf('batch_size：8')>=0);
ok('notes', a.markdown.indexOf('补充说明')>=0 && a.markdown.indexOf('不捏造')>=0);
var b=A.buildFineTuneSpec({epochs:'200',batchSize:'999'});
ok('clamp', b.epochs===100 && b.batchSize===512 && b.markdown.indexOf('UntitledFT')>=0 && b.hasNotes===false);
console.log('FineTuneSpecForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
