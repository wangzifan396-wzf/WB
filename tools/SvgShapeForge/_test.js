
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('buildRect', A.buildRect(0,0,10,20).indexOf('<rect')===0 && A.buildRect(0,0,10,20).indexOf('width="10"')>=0 && A.buildRect(0,0,10,20).indexOf('height="20"')>=0);
ok('buildRect rx', A.buildRect(0,0,10,20,5).indexOf('rx="5"')>=0);
ok('buildCircle', A.buildCircle(50,50,40).indexOf('<circle')>=0 && A.buildCircle(50,50,40).indexOf('cx="50"')>=0);
ok('buildPolygon', A.buildPolygon(0,0,10,3).indexOf('<polygon')===0 && A.buildPolygon(0,0,10,3).indexOf('points=')>=0);
ok('buildStar', A.buildStar(50,50,40,20,5).indexOf('<polygon')===0 && A.buildStar(50,50,40,20,5).indexOf('points=')>=0 && A.buildStar(50,50,40,20,5).length>40);
ok('polygonPoints count', A.polygonPoints(0,0,10,4).split(' ').length===4);
console.log('SvgShapeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
