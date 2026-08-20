
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var pm=A.parseMatrix('价格 | 低 | 中 | 高');
ok('matrix', pm.length===1 && pm[0][0]==='价格' && pm[0][1]==='低' && pm[0][3]==='高');
var a=A.buildCompetitive({product:'WB',competitors:'竞品A\n竞品B',dimensions:'价格\n功能',matrix:'价格 | 免费 | 订阅 | 买断\n功能 | 广 | 中 | 广'});
ok('full', a.dimCount===2 && a.compCount===3 && a.rowCount===2 && a.title.indexOf('WB')>=0 && a.markdown.indexOf('自家(WB)')>=0 && a.markdown.indexOf('竞品A')>=0 && a.markdown.indexOf('竞品B')>=0);
ok('table', a.markdown.indexOf('| 维度 | 自家(WB) | 竞品A | 竞品B |')>=0 && a.markdown.indexOf('| 价格 | 免费 | 订阅 | 买断 |')>=0 && a.markdown.indexOf('结论与建议')>=0);
var b=A.buildCompetitive({product:'WB',competitors:'X',dimensions:'价格',matrix:''});
ok('skeleton', b.compCount===1 && b.rowCount===0 && b.markdown.indexOf('对比矩阵（骨架）')>=0 && b.markdown.indexOf('| （待填） | （待填） | （待填） |')>=0);
var c=A.buildCompetitive({});
ok('empty', c.dimCount===0 && c.compCount===0 && c.rowCount===0 && c.markdown.indexOf('（自家产品）')>=0);
console.log('CompetitiveForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
