
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var p=P.smParse('https://a.com\nhttps://b.com');
ok(p.urls.length===2 && p.errors.length===0,'parse 2');
var p2=P.smParse('not url');
ok(p2.urls.length===0 && p2.errors.length===1,'bad url');
var p3=P.smParse('https://a.com\n\nftp://x');
ok(p3.urls.length===1,'skip ftp');
var x=P.smBuild(['https://a.com'], {changefreq:'weekly', priority:0.8});
ok(x.indexOf('<loc>https://a.com</loc>')>=0,'loc');
ok(x.indexOf('weekly')>=0 && x.indexOf('0.8')>=0,'cf+prio');
ok(P.smEsc('a&b<c>')==='a&amp;b&lt;c&gt;','esc');
var x2=P.smBuild(['https://a.com/?x=1&y=2'], {});
ok(x2.indexOf('&amp;')>=0,'esc url');
console.log('PASS '+n+' assertions');
