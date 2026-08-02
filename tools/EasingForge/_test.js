
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.easingFn('linear',0.5)===0.5, 'linear 0.5');
ok(P.easingFn('easeInQuad',0.5)===0.25, 'easeInQuad 0.5');
ok(Math.abs(P.easingFn('easeOutCubic',0.5)-0.875)<1e-9, 'easeOutCubic 0.5');
ok(P.easingFn('nope',0.3)===0.3, 'unknown -> identity');
ok(Math.abs(P.bezier(0.25,0.1,0.25,1,0))<1e-6, 'bezier t=0');
ok(Math.abs(P.bezier(0.25,0.1,0.25,1,1)-1)<1e-6, 'bezier t=1');
ok(P.bezier(0,0,1,1,0.5)===0.5, 'linear bezier 0.5');
ok(typeof P.EASINGS.linear==='function', 'EASINGS present');
console.log('EasingForge _test: '+n+' passed, 0 failed');
