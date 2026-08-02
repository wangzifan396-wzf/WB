const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b,eps){ return Math.abs(a-b)<(eps||1e-9); }
var bj={lat:39.9042,lng:116.4074}, sh={lat:31.2304,lng:121.4737};
var d=A.haversine(bj,sh);
ok('beijing-shanghai ~1067km', d>1050 && d<1080);
ok('same point zero', near(A.haversine(bj,bj),0));
ok('symmetric', near(A.haversine(bj,sh), A.haversine(sh,bj)));
ok('equator 1 deg lng ~111.19km', near(A.haversine({lat:0,lng:0},{lat:0,lng:1}), 111.1949, 0.01));
ok('bearing due east', near(A.bearing({lat:0,lng:0},{lat:0,lng:1}), 90, 0.01));
ok('bearing due north', near(A.bearing({lat:0,lng:0},{lat:1,lng:0}), 0, 0.01));
var dst=A.destination({lat:0,lng:0}, 90, 111.1949);
ok('destination east 1 deg', near(dst.lng, 1, 0.001) && near(dst.lat, 0, 0.001));
var rt=A.haversine(A.destination(bj, 45, 100), bj);
ok('destination roundtrip 100km', near(rt, 100, 0.01));
var bb=A.boundingBox({lat:0,lng:0}, 111.1949);
ok('bbox equator ~1deg', near(bb.maxLat,1,0.001) && near(bb.maxLng,1,0.001));
ok('parse ok', A.parseLatLng('39.9, 116.4').value.lat===39.9);
ok('parse bad lat', A.parseLatLng('91, 0').error!==null);
ok('parse bad format', A.parseLatLng('39.9').error!==null);
console.log('GeoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
