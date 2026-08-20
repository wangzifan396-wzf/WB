
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildJd({title:'前端工程师',team:'WB 平台',level:'中级',location:'上海',resp:'前端开发\n协作设计',req:'3 年经验\n精通 JS',nice:'开源贡献',ben:'竞争力薪资'});
ok('full', a.respCount===2 && a.reqCount===2 && a.niceCount===1 && a.benCount===1 && a.title.indexOf('前端工程师')>=0 && a.markdown.indexOf('WB 平台')>=0 && a.markdown.indexOf('上海')>=0);
ok('sections', a.markdown.indexOf('职位概述')>=0 && a.markdown.indexOf('工作职责')>=0 && a.markdown.indexOf('任职要求')>=0 && a.markdown.indexOf('加分项')>=0 && a.markdown.indexOf('薪酬与福利')>=0);
ok('content', a.markdown.indexOf('- 前端开发')>=0 && a.markdown.indexOf('- 3 年经验')>=0 && a.markdown.indexOf('- 开源贡献')>=0);
var b=A.buildJd({});
ok('empty', b.title.indexOf('（待填写职位名称）')>=0 && b.respCount===1 && b.reqCount===1 && b.niceCount===1 && b.benCount===1 && b.markdown.indexOf('（待补充工作职责）')>=0 && b.markdown.indexOf('（无特别加分项）')>=0);
console.log('JdForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
