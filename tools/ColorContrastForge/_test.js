
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.ccParseColor('#fff').r===255 && P.ccParseColor('#fff').g===255,'#fff expands');
ok(P.ccParseColor('#000000').r===0 && P.ccParseColor('#000000').b===0,'#000000');
ok(P.ccParseColor('rgb(255,0,0)').r===255,'rgb parses');
ok(P.ccParseColor('bad')===null,'bad null');
ok(P.ccParseColor('#12')===null,'short hex null');
ok(P.ccContrast({r:0,g:0,b:0},{r:255,g:255,b:255})===21,'black on white 21');
ok(P.ccContrast({r:255,g:255,b:255},{r:255,g:255,b:255})===1,'white on white 1');
ok(P.ccContrast({r:0,g:0,b:0},{r:0,g:0,b:0})===1,'black on black 1');
var lv=P.ccLevel(21);
ok(lv.AA && lv.AAA && lv.AALarge,'21 passes all');
ok(P.ccLevel(2).AA===false,'2 fails AA');
ok(P.ccLevel(4.5).AA===true,'4.5 passes AA');
ok(P.ccLevel(7).AAA===true,'7 passes AAA');
ok(P.ccLevel(2.9).AALarge===false,'2.9 fails large');
ok(Math.abs(P.ccLum({r:255,g:255,b:255})-1)<1e-9,'white lum 1');
ok(P.ccLum({r:0,g:0,b:0})===0,'black lum 0');
ok(P.ccContrast(P.ccParseColor('#777'),P.ccParseColor('#fff'))>4,'#777 on white passes AA');
console.log('PASS '+n+' assertions');
