
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
function ev(src,x){ const r=P.plotParse(src); if(r.error) throw new Error(r.error); return r.fn(x); }
ok(ev('1+2*3',0)===7,'precedence mul over add');
ok(ev('(1+2)*3',0)===9,'parens');
ok(ev('2^3',0)===8,'power');
ok(ev('2^3^2',0)===512,'power right assoc');
ok(ev('-x^2',3)===-9,'unary minus binds below pow');
ok(ev('x',5)===5,'variable x');
ok(Math.abs(ev('sin(pi)',0))<1e-10,'sin(pi)~0');
ok(Math.abs(ev('cos(0)',0)-1)<1e-12,'cos(0)=1');
ok(ev('sqrt(16)',0)===4,'sqrt');
ok(ev('abs(0-7)',0)===7,'abs');
ok(Math.abs(ev('e',0)-Math.E)<1e-12,'const e');
ok(ev('x*x-4',3)===5,'polynomial');
ok(ev('10/4',0)===2.5,'division');
ok(P.plotParse('').error!==null,'empty error');
ok(P.plotParse('sin(x').error!==null,'unclosed paren error');
ok(P.plotParse('foo(x)').error!==null,'unknown func error');
ok(P.plotParse('1+#').error!==null,'bad char error');
ok(P.plotParse('sin x').error!==null,'func needs parens');
const pts=P.plotSample(function(x){ return x*2; }, 0, 10, 11);
ok(pts.length===11 && pts[0][0]===0 && pts[10][0]===10,'sample range');
ok(pts[5][1]===10,'sample values');
const nan=P.plotSample(function(x){ return Math.sqrt(x); }, -4, -1, 5);
ok(nan.every(p=>p[1]===null),'non-finite -> null');
const svg=P.plotSvg(P.plotParse('x^2'), -5, 5);
ok(svg.indexOf('<svg')===0,'svg root');
ok(svg.indexOf('<path')>0,'svg has curve path');
ok(P.plotSvg(P.plotParse('x'), 5, 5)==='','invalid range empty');
console.log('PASS '+n+' assertions');
