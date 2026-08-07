
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('render basic', A.render("A {0} went to {1}.", ["cat","school"])==="A cat went to school.");
ok('render missing -> placeholder', A.render("Hi {0} {1}", ["x"])==="Hi x ___");
ok('render all', A.render("{0}{1}{2}", ["a","b","c"])==="abc");
ok('stories count', A.STORIES.length>=3);
ok('getStory wraps', A.getStory(0).title && A.getStory(0).tpl.indexOf("{0}")>=0);
console.log('MadLibForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
