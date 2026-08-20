
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var kv=A.parseKV('train: 1000000\nvalid: 100000');
ok('kv', kv.length===2 && kv[0].k==='train' && kv[0].v==='1000000');
var a=A.buildDatasetCard({name:'WikiZH',type:'文本',domain:'中文百科',summary:'中文维基语料',source:'公开维基',size:'1.2M',format:'JSONL',splits:'train: 1000000\nvalid: 100000',uses:'预训练\n微调',limits:'编辑偏见\n时效',license:'CC BY-SA 4.0'});
ok('full', a.useCount===2 && a.limitCount===2 && a.title.indexOf('WikiZH')>=0 && a.markdown.indexOf('文本')>=0 && a.markdown.indexOf('CC BY-SA 4.0')>=0);
ok('sections', a.markdown.indexOf('概述')>=0 && a.markdown.indexOf('预期用途')>=0 && a.markdown.indexOf('数据构成')>=0 && a.markdown.indexOf('许可与合规')>=0 && a.markdown.indexOf('已知局限与偏差')>=0);
ok('splits', a.markdown.indexOf('train：1000000')>=0 && a.markdown.indexOf('valid：100000')>=0);
var b=A.buildDatasetCard({});
ok('empty', b.markdown.indexOf('UnnamedDataset')>=0 && b.useCount===1 && b.limitCount===1 && b.markdown.indexOf('（待补充规模）')>=0 && b.markdown.indexOf('建议在发布前做')>=0);
console.log('DatasetCardForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
