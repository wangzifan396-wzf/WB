
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var chrome='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
var r1=A.parse(chrome);
ok('chrome', r1.browser==='Chrome' && /Windows/.test(r1.os));
var android='Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36';
var r2=A.parse(android);
ok('android', r2.os==='Android' && r2.device==='Mobile');
var ios='Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
var r3=A.parse(ios);
ok('ios', r3.os==='iOS' && r3.device==='Mobile' && r3.browser==='Safari');
var ff='Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0';
var r4=A.parse(ff);
ok('ff', r4.browser==='Firefox' && r4.os==='macOS' && r4.engine==='Gecko');
console.log('UaParseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
