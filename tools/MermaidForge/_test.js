
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.buildMermaid('A -> B : 标签\nC -> D', 'flowchart');
ok('header', r.code.indexOf('flowchart TD')===0);
ok('edge', r.code.indexOf('A -->|标签| B')>=0);
ok('count', r.edgeCount===2);
var s=A.buildMermaid('a -> b', 'sequence');
ok('seq', s.code.indexOf('sequenceDiagram')===0);
ok('cn', A.buildMermaid('开始 -> 结束').code.indexOf('开始 --> 结束')>=0);
console.log('MermaidForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
