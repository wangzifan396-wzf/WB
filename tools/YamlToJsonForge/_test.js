
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var o=A.parseYaml('name: Alice\nage: 30\nactive: true');
ok('parse name', o.name==='Alice');
ok('parse age', o.age===30);
ok('parse bool', o.active===true);
ok('emit simple', A.emitYaml({name:'Alice',age:30})==='name: Alice\nage: 30');
ok('roundtrip scalar', A.parseYaml(A.emitYaml({x:1,y:2})).x===1);
console.log('YamlToJsonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
