
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('parse', A.parseBandwidth('1Gbps')===1e9 && A.parseBandwidth('100 Mbps')===1e8 && A.parseBandwidth('10 Gb/s')===1e10 && A.parseBandwidth('500Kbps')===5e5 && A.parseBandwidth('abc')===null && A.parseBandwidth('')===null);
var r=A.calcBdp({bandwidth:'1Gbps', rttMs:100, windowBytes:65536, payloadBytes:100000000});
ok('bdp', r.bdpBytes===12500000 && r.bdpHuman==='11.92 MiB' && r.windowSufficient===false);
ok('util', Math.abs(r.utilizationPct-0.52)<0.005 && Math.abs(r.windowLimitedBps-5242880)<1 && r.windowLimitedHuman==='5.24 Mbps');
ok('transfer', r.idealTransferSec===0.8 && r.transferRttCount===1526 && r.effectiveTransferSec===152.6);
ok('verdict', r.verdict.indexOf('窗口不足')>=0);
var r2=A.calcBdp({bandwidth:'100 Mbps', rttMs:10});
ok('bdp2', r2.bdpBytes===125000 && r2.windowSufficient===null && r2.verdict.indexOf('未填窗口')>=0);
var r3=A.calcBdp({bandwidth:'1Gbps', rttMs:10, windowBytes:1250000});
ok('suff', r3.windowSufficient===true && r3.verdict.indexOf('窗口充足')>=0);
ok('err', !!A.calcBdp({bandwidth:'xx', rttMs:10}).error && !!A.calcBdp({bandwidth:'1Gbps', rttMs:0}).error);
var tb=A.bdpTable(1e9,[10,50,100,200]);
ok('table', tb.length===4 && tb[0].bdpBytes===1250000 && tb[2].bdpBytes===12500000);
ok('fmt', A.fmtBytes(12500000)==='11.92 MiB' && A.fmtBits(5242880)==='5.24 Mbps' && A.fmtBytes(65536)==='64 KiB' && A.fmtBits(1e9)==='1 Gbps');
console.log('BdpForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
