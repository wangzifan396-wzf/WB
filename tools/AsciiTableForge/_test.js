
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var t=P.asciiTable([['Name','Age'],['Alice',30],['Bob',25]]);
ok(t.indexOf('+')>=0, 'has border');
ok(t.indexOf('|')>=0, 'has pipes');
ok(t.indexOf('Name')>=0 && t.indexOf('Alice')>=0, 'has content');
ok(P.asciiTable([])==='', 'empty -> empty');
var t2=P.asciiTable([['a','b'],['x','y']]);
ok(t2.split('\n').length===5, 'row count (5 lines)');
console.log('AsciiTableForge _test: '+n+' passed, 0 failed');
