
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
// DGP: x 为低自相关伪随机序列（白噪声近似），y[t]=0.5 y[t-1]+0.5 x[t-1]（x 为真实因）
var n=500, x=[], y=[], seed=12345;
function rnd(){ seed=(seed*1103515245+12345)%2147483648; return seed/2147483648*2-1; }
x.push(rnd()); y.push(0);
for(var t=1;t<n;t++){ x.push(rnd()); y.push(0.5*y[t-1]+0.5*x[t-1]); }
var fxy=A.granger(y,x,1).F;
var fyx=A.granger(x,y,1).F;
ok('x->y strong (F>10)', fxy>10);
ok('directionality x->y > y->x', fxy>fyx);
ok('y->x not negative (well-conditioned)', fyx>-0.1);
console.log('GrangerForge _test: fxy='+fxy.toFixed(2)+' fyx='+fyx.toFixed(2)+' ; '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
