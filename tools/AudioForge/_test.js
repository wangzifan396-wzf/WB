// Node test harness: extract the first <script> from index.html and run the
// pure functions in a CommonJS context, then assert behaviour.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }

// Provide a module/exports so the `if(typeof module!=='undefined'...)` guard runs.
const moduleShim = { exports: {} };
const fn = new Function('module', 'exports', 'require', m[1]);
fn(moduleShim, moduleShim.exports, require);
const A = moduleShim.exports;

let passed = 0, failed = 0;
function ok(name, cond) {
  if (cond) { passed++; }
  else { failed++; console.error('  ✗ ' + name); }
}
function approx(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-6); }

// clamp
ok('clamp low', A.clamp(-5, 0, 10) === 0);
ok('clamp high', A.clamp(50, 0, 10) === 10);
ok('clamp mid', A.clamp(5, 0, 10) === 5);

// formatBytes
ok('bytes B', A.formatBytes(512) === '512 B');
ok('kb', A.formatBytes(2048) === '2.0 KB');
ok('mb', A.formatBytes(1048576) === '1.00 MB');

// computePeaks
const data = new Float32Array(1000);
for (let i = 0; i < 1000; i++) data[i] = (i < 500 ? 0.9 : 0.1) * Math.sin(i / 10);
const pk = A.computePeaks(data, 10);
ok('peaks length', pk.length === 10);
ok('peaks range', pk.every(v => v >= 0 && v <= 1));
ok('peaks first bucket large', pk[0] > pk[5]); // first half has larger amplitude

// applyGainToChannel
const g = A.applyGainToChannel(new Float32Array([0.5, -0.5]), 2);
ok('gain x2', approx(g[0], 1.0) && approx(g[1], -1.0));
const g0 = A.applyGainToChannel(new Float32Array([0.5]), 1);
ok('gain x1 copy', g0[0] === 0.5);

// applyFadeToChannel (use length > fade region so endpoints are unambiguous)
const fd = A.applyFadeToChannel(new Float32Array([1, 1, 1, 1, 1, 1, 1, 1]), 'in', 4);
ok('fade-in first ~0', approx(fd[0], 0, 1e-6));
ok('fade-in last =1', approx(fd[3], 1, 1e-6));
const fo = A.applyFadeToChannel(new Float32Array([1, 1, 1, 1, 1, 1, 1, 1]), 'out', 4);
ok('fade-out start kept =1', approx(fo[0], 1, 1e-6));
ok('fade-out last ~0', approx(fo[7], 0, 1e-6));
ok('fade 0 returns copy', A.applyFadeToChannel(new Float32Array([0.5]), 'in', 0)[0] === 0.5);

// normalizeChannel
const nc = A.normalizeChannel(new Float32Array([0.2, -0.2, 0.1]));
let mx = 0; nc.forEach(v => { if (Math.abs(v) > mx) mx = Math.abs(v); });
ok('normalize peak ~0.891', approx(mx, 0.891, 1e-3));
ok('normalize silent', A.normalizeChannel(new Float32Array([0,0,0]))[0] === 0);

// reverseChannel
const rv = A.reverseChannel(new Float32Array([1, 2, 3]));
ok('reverse', rv[0] === 3 && rv[2] === 1);

// resampleChannel
const rs = A.resampleChannel(new Float32Array([0, 1, 2, 3]), 4, 2);
ok('resample length', rs.length === 2);
ok('resample midpoint', approx(rs[1], 2.0, 1e-6));
ok('resample same rate = copy', A.resampleChannel(new Float32Array([0.5]), 44100, 44100)[0] === 0.5);

// encodeWAVFromChannels
const wav = A.encodeWAVFromChannels([new Float32Array([0, 1, -1, 0.5])], 44100);
ok('wav is Uint8Array', wav instanceof Uint8Array);
ok('wav RIFF header', String.fromCharCode(wav[0], wav[1], wav[2], wav[3]) === 'RIFF');
ok('wav WAVE header', String.fromCharCode(wav[8], wav[9], wav[10], wav[11]) === 'WAVE');
ok('wav size = 44 + frames*2*ch', wav.length === 44 + 4 * 2 * 1);
ok('wav sampleRate field', (wav[24] | wav[25] << 8 | wav[26] << 16 | wav[27] << 24) === 44100);

console.log(`\nAudioForge _test: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
