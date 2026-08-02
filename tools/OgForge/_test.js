
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var w=P.ogWrap('hello world foo',11);
ok(w.length===2,'wrap 2 lines');
ok(w[0]==='hello world','wrap line1');
ok(w[1]==='foo','wrap line2');
ok(P.ogWrap('',10).length===0,'wrap empty');
var lw=P.ogWrap('abcdefghijklmno',5);
ok(lw.length===3 && lw[0]==='abcde','wrap long word split');
ok(P.ogFontSize('short')===96,'font tiny title');
ok(P.ogFontSize('a'.repeat(20))===76,'font mid title');
ok(P.ogFontSize('a'.repeat(30))===60,'font long title');
ok(P.ogFontSize('a'.repeat(60))===48,'font huge title');
ok(P.ogColor('#22D3EE')==='#22D3EE','color valid');
ok(P.ogColor('blue')==='#5E6AD2','color fallback');
ok(P.ogEsc('<&">')==='&lt;&amp;&quot;&gt;','escape');
var meta=P.ogMeta({title:'T"x',subtitle:'S'});
ok(meta.indexOf('og:title')>=0,'meta og:title');
ok(meta.indexOf('T&quot;x')>=0,'meta title escaped');
ok(meta.indexOf('twitter:card')>=0,'meta twitter card');
ok(meta.split('\n').length===7,'meta 7 lines');
console.log('PASS '+n+' assertions');
