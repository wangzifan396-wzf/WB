
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.wcCount('hello world').words===2,'2 words');
ok(P.wcCount('hello world').chars===11,'11 chars');
ok(P.wcCount('你好世界').words===4,'4 cjk');
ok(P.wcCount('Hello world. How are you?').sentences===2,'2 sentences');
ok(P.wcCount('Hello world. How are you?').words===5,'5 words');
ok(P.wcCount('a\n\nb').paragraphs===2 && P.wcCount('a\n\nb').lines===3,'para/lines');
ok(P.wcCount('').words===0 && P.wcCount('').readMin===1,'empty');
ok(P.wcCount('word word word').readMin===1,'read min floor');
console.log('PASS '+n+' assertions');
