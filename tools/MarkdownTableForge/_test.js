
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var md=A.toMd(['a','b'],[['1','2'],['3','4']]);
ok('toMd header', md.indexOf('| a | b |')>=0);
ok('toMd rows', md.indexOf('| 1 | 2 |')>=0 && md.indexOf('| 3 | 4 |')>=0);
var p=A.fromMd(md);
ok('fromMd headers', p.headers.join(',')==='a,b');
ok('fromMd rows', p.rows.length===2 && p.rows[1][1]==='4');
console.log('MarkdownTableForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
