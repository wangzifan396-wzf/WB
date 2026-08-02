const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// canonical vectors
ok('encode jutland', A.ghEncode(57.64911,10.40744,11).value==='u4pruydqqvj');
ok('encode ezs42', A.ghEncode(42.605,-5.603,5).value==='ezs42');
var d=A.ghDecode('ezs42').value;
ok('decode lat', Math.abs(d.lat-42.60498046875)<1e-9);
ok('decode lon', Math.abs(d.lon-(-5.60302734375))<1e-9);
ok('decode err bounds', d.latErr>0 && d.lonErr>0 && d.latErr<0.05 && d.lonErr<0.05);
// roundtrip: decode center re-encodes to same hash
var h1=A.ghEncode(39.916,116.397,9).value;
var c=A.ghDecode(h1).value;
ok('roundtrip stable', A.ghEncode(c.lat,c.lon,9).value===h1);
// precision monotonic: longer hash shares prefix
ok('prefix property', A.ghEncode(57.64911,10.40744,6).value==='u4pruy' && 'u4pruydqqvj'.indexOf('u4pruy')===0);
// neighbors
var nb=A.ghNeighbors('ezs42');
ok('neighbors ok', nb.error===null && Object.keys(nb.value).length===8);
ok('north is above', A.ghDecode(nb.value.n).value.lat > d.lat);
ok('south is below', A.ghDecode(nb.value.s).value.lat < d.lat);
ok('east is right', A.ghDecode(nb.value.e).value.lon > d.lon);
ok('neighbor same len', nb.value.n.length===5);
ok('n->s inverse', A.ghNeighbor(nb.value.n,-1,0).value==='ezs42');
// errors
ok('bad lat', A.ghEncode(91,0,5).error!==null);
ok('bad lon', A.ghEncode(0,181,5).error!==null);
ok('bad precision', A.ghEncode(0,0,13).error!==null);
ok('bad char', A.ghDecode('abci').error!==null);
ok('empty hash', A.ghDecode('').error!==null);
// dateline wrap
var dl=A.ghNeighbor(A.ghEncode(0,179.99,5).value,0,1);
ok('dateline wrap', dl.error===null && A.ghDecode(dl.value).value.lon<0);
console.log('GeohashForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
