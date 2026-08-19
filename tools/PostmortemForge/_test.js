
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.buildPostmortem({title:'X', impact:'Y',
  timeline:'a\nb', root:'R', actions:'do1\ndo2'});
ok('title', r.title==='X');
ok('md', r.markdown.indexOf('事故复盘')>=0 && r.markdown.indexOf('改进项')>=0);
ok('tl', r.timelineCount===2);
ok('acts', r.actionCount===2);
ok('empty', A.buildPostmortem({}).actionCount===0 && A.buildPostmortem({}).markdown.indexOf('待补充')>=0);
console.log('PostmortemForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
