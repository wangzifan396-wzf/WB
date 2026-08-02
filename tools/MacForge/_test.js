
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
function lcg(seed){ return function(){ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; }; }
ok(P.macValid('00:1B:44:11:22:33')===true,'valid colon');
ok(P.macValid('001B44112233')===false,'no sep invalid');
ok(P.macFormat('00-1B-44-11-22-33',':').mac==='00:1B:44:11:22:33','format');
ok(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(P.macRandom(':', lcg(5))),'random format');
ok(P.macIsMulticast('01:00:00:00:00:00')===true,'multicast');
ok(P.macIsMulticast('00:00:00:00:00:00')===false,'not multicast');
ok(P.macIsLocal('02:00:00:00:00:00')===true,'local');
ok(P.macOui('00:1B:44:11:22:33').vendor==='Juniper','oui known');
ok(P.macOui('AA:BB:CC:DD:EE:FF').vendor==='未知厂商','oui unknown');
ok(P.macFormat('xyz').error!==null,'bad format');
console.log('PASS '+n+' assertions');
