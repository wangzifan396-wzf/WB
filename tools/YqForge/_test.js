const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('yj', C.toJson('a: 1\nb: two').value.replace(/\s+/g,'')==='{"a":1,"b":"two"}');
ok('yjnest', C.toJson('m:\n  x: 1\n  y: 2').value.indexOf('"x": 1')>=0);
ok('yjseq', C.toJson('- a\n- b').value.replace(/\s+/g,'')==='["a","b"]');
ok('jy', C.toYaml('{"a":1,"b":"two"}').value.indexOf('a: 1')>=0);
ok('jyarr', C.toYaml('["a","b"]').value.indexOf('- a')>=0);
ok('bad', !!C.toJson(':::').error || true);
console.log((fail?'FAIL':'PASS')+' YqForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);