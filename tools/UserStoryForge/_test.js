
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var md=A.toMarkdown('管理员 / 导出报表 / 复盘');
ok('count', md.count===1);
ok('md', md.markdown.indexOf('用户故事')>=0 && md.markdown.indexOf('作为管理员')>=0);
var s=A.genStory('游客，浏览商品');
ok('story', s.story==='作为游客，我希望浏览商品，以便达成业务目标。');
ok('parse', A.parseStory('a / b / c').role==='a' && A.parseStory('a / b / c').value==='c');
ok('empty', A.splitLines('  \n  ').length===0);
console.log('UserStoryForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
