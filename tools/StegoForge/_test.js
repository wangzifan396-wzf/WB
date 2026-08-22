
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('capfn', A.capacityBytes(16,16)===96 && A.capacityBytes(4,4)===6 && A.capacityBytes(0,5)===0);
var data=new Uint8Array(16*16*4);
for(var i=0;i<data.length;i++) data[i]=(i*31+7)&255;
var e=A.encodeLsb(data,'秘密消息');
ok('enc', !e.error && e.bytesUsed===18 && e.capacity===96 && e.pixelsUsed===48 && e.changedBytes>0 && e.changedBytes<=144);
var maxDiff=0;
for(var j=0;j<data.length;j++){ var d=Math.abs(e.data[j]-data[j]); if(d>maxDiff)maxDiff=d; }
ok('lsb', maxDiff<=1);
var d2=A.decodeLsb(e.data);
ok('dec', d2.ok===true && d2.text==='秘密消息' && d2.bytesUsed===18);
ok('ascii', A.decodeLsb(A.encodeLsb(data,'hello').data).text==='hello');
var e2=A.encodeLsb(new Uint8Array(4*4*4),'1234567');
ok('cap-err', !!e2.error && e2.error.indexOf('容量不足')>=0 && e2.needed===13 && e2.capacity===6);
var d3=A.decodeLsb(new Uint8Array(16*16*4));
ok('nomagic', d3.ok===false && d3.error.indexOf('未检测到')>=0);
ok('toosmall', A.decodeLsb(new Uint8Array(4*4*4)).ok===false);
ok('utf8rt', A.utf8Decode(A.utf8Encode('aé中'))==='aé中');
console.log('StegoForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
