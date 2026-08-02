
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

ok(P.cfParseNote('C') === 0 && P.cfParseNote('B') === 11, 'note parsing');
ok(P.cfParseNote('Db') === 1, 'flat alias maps to sharp');
ok(P.cfParseNote('H') === null, 'invalid note rejected');
var pr = P.cfParseNotes('C E G');
ok(!pr.error && pr.pcs.join(',') === '0,4,7', 'parse note list');
ok(P.cfParseNotes('C X').error !== undefined, 'bad list rejected');
// C major triad
var hits = P.cfDetect([0,4,7]);
ok(hits.some(function(h){ return h.root === 'C' && h.name.indexOf('大三') === 0; }), 'C major detected');
// A minor triad
var am = P.cfDetect([9,0,4]);
ok(am.some(function(h){ return h.root === 'A' && h.name.indexOf('小三') === 0; }), 'A minor detected');
// Cmaj7
var c7 = P.cfDetect([0,4,7,11]);
ok(c7.some(function(h){ return h.root === 'C' && h.name.includes('maj7'); }), 'Cmaj7 detected');
// G7 dominant
var g7 = P.cfDetect([7,11,2,5]);
ok(g7.some(function(h){ return h.root === 'G' && h.name.includes('属七'); }), 'G7 detected');
// inversion flag: E G C is C major first inversion (root not first)
var inv = P.cfDetect([4,7,0]);
ok(inv.some(function(h){ return h.root === 'C'; }), 'inversion still finds C root');
// scales
ok(P.cfNames(P.cfScale(0, 'major')).join(' ') === 'C D E F G A B', 'C major scale');
ok(P.cfNames(P.cfScale(9, 'minor')).join(' ') === 'A B C D E F G', 'A minor scale');
ok(P.cfScale(0, 'pentMajor').length === 5, 'pentatonic has 5 notes');
ok(P.cfScale(0, 'blues').length === 6, 'blues has 6 notes');
ok(P.cfScale(0, 'nope') === null, 'unknown scale null');
console.log('PASS '+n+' assertions');
