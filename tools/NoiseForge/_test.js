
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var f1=P.nzField(16,16,0.1,7), f2=P.nzField(16,16,0.1,7);
ok(JSON.stringify(f1)===JSON.stringify(f2), 'deterministic by seed');
var f3=P.nzField(16,16,0.1,8);
ok(JSON.stringify(f1)!==JSON.stringify(f3), 'different seed differs');
var inRange=true, coherent=true, prev=f1[0][0];
for(var y=0;y<16;y++) for(var x=0;x<16;x++){ var v=f1[y][x]; if(v<0||v>1) inRange=false; if(Math.abs(v-prev)>0.9) coherent=false; prev=v; }
ok(inRange, 'all values in [0,1]');
ok(coherent, 'adjacent coherence (no hard jumps)');
var c=P.nzRamp(0.2,'terrain'); ok(c.length===3 && c[2]===140, 'terrain ramp water');
console.log('PASS '+n+' assertions');
