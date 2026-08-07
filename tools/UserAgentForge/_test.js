
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.parse('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
ok('chrome', r.browser==='Chrome');
ok('windows', r.os==='Windows 10/11');
ok('desktop', r.device==='Desktop');
var iph=A.parse('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
ok('iphone mobile', iph.device==='Mobile');
ok('iphone safari', iph.browser==='Safari');
ok('ios', iph.os==='iOS');
console.log('UserAgentForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
