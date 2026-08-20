
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildSkillSpec({name:'PDF 摘要',desc:'当用户要总结 PDF 时使用',trigger:'收到 PDF 文件时',steps:'读取文件\n提取要点\n生成摘要',constraints:'仅本地处理\n不外传',notes:'中文输出'});
ok('full', a.stepCount===3 && a.constraintCount===2 && a.hasTrigger===true && a.slug==='pdf-摘要' && a.title.indexOf('PDF 摘要')>=0 && a.markdown.indexOf('name: pdf-摘要')>=0 && a.markdown.indexOf('description: 当用户要总结 PDF 时使用')>=0 && a.markdown.indexOf('## 步骤')>=0 && a.markdown.indexOf('1. 读取文件')>=0 && a.markdown.indexOf('仅本地处理')>=0);
ok('frontmatter', a.markdown.indexOf('---')===0 && a.markdown.indexOf('name:')>=0 && a.markdown.indexOf('description:')>=0 && a.markdown.indexOf('# PDF 摘要')>=0);
var b=A.buildSkillSpec({});
ok('empty', b.stepCount===1 && b.constraintCount===2 && b.hasTrigger===false && b.markdown.indexOf('（待填写')>=0 && b.markdown.indexOf('（待补充执行步骤）')>=0);
console.log('SkillSpecForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
