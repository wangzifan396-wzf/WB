
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var p0=[0,0], c1=[0,10], c2=[10,0], p3=[10,10];
var a=P.bzAt(0,p0,c1,c2,p3); ok(a[0]===0&&a[1]===0,'t=0 start');
var b=P.bzAt(1,p0,c1,c2,p3); ok(Math.abs(b[0]-10)<1e-9&&Math.abs(b[1]-10)<1e-9,'t=1 end');
var mid=P.bzAt(0.5,p0,c1,c2,p3); ok(mid[0]>0&&mid[0]<10,'mid in range');
var pts=[[0,0],[10,10],[20,20],[30,30]];
ok(P.bzPath(pts).indexOf('C')===P.bzPath(pts).length-P.bzPath(pts).length+2 || /C/.test(P.bzPath(pts)), 'path has C');
var svg=P.bzSvg(pts); ok(/<path d="M0 0 C/.test(svg), 'svg path correct');
ok(P.bzPolyline(pts,10).length>0, 'polyline produced');
console.log('PASS '+n+' assertions');
