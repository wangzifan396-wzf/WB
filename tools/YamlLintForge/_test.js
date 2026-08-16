
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var src='name: demo\nversion: 2\ntags:\n  - a\n  - b\nserver:\n  host: localhost\n  port: 8080';
var p=A.parseYaml(src);
ok('ok',p.ok===true);
ok('flat',p.value.name==='demo' && p.value.version===2);
ok('seq',JSON.stringify(p.value.tags)===JSON.stringify(['a','b']));
ok('nested',p.value.server.host==='localhost' && p.value.server.port===8080);
var round=A.parseYaml(A.formatYaml(p.value));
ok('roundtrip',JSON.stringify(round.value)===JSON.stringify(p.value));
console.log('YamlLintForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
