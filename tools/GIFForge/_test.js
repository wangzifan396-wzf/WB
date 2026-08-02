/* GIFForge unit tests — run: node _test.js */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FATAL: no script block found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const GF = mod.exports;

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.error('FAIL  ' + name); }
}
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ')'); }
function arrEq(a, b, name) { ok(JSON.stringify(a) === JSON.stringify(b), name + ' (got ' + JSON.stringify(a).slice(0, 80) + ')'); }

/* ============== reference LZW decoder (GIF variable-code-size) ============== */
function lzwDecode(bytes, minCodeSize) {
  const clear = 1 << minCodeSize, eoi = clear + 1;
  let codeSize = minCodeSize + 1, mask = (1 << codeSize) - 1;
  let pos = 0, acc = 0, nbits = 0;
  function read() {
    while (nbits < codeSize) {
      acc |= (pos < bytes.length ? bytes[pos++] : 0) << nbits;
      nbits += 8;
    }
    const code = acc & mask; acc >>>= codeSize; nbits -= codeSize;
    return code;
  }
  let dict, next, prev = null;
  const out = [];
  function reset() {
    dict = [];
    for (let i = 0; i < clear; i++) dict[i] = [i];
    next = eoi + 1; codeSize = minCodeSize + 1; mask = (1 << codeSize) - 1; prev = null;
  }
  reset();
  for (let guard = 0; guard < 1e6; guard++) {
    const code = read();
    if (code === clear) { reset(); continue; }
    if (code === eoi) return out;
    let entry;
    if (code < next && dict[code]) entry = dict[code];
    else if (code === next && prev) entry = prev.concat(prev[0]);
    else throw new Error('bad LZW code ' + code + ' (next=' + next + ')');
    for (let i = 0; i < entry.length; i++) out.push(entry[i]);
    if (prev !== null && next < 4096) {
      dict[next++] = prev.concat(entry[0]);
      if (next >= (1 << codeSize) && codeSize < 12) { codeSize++; mask = (1 << codeSize) - 1; }
    }
    prev = entry;
  }
  throw new Error('LZW decode did not terminate');
}

/* ============== minimal GIF structural parser ============== */
function parseGif(bytes) {
  const b = bytes;
  let p = 0;
  const u16 = () => b[p++] | (b[p++] << 8);
  const sig = String.fromCharCode(b[0], b[1], b[2], b[3], b[4], b[5]);
  p = 6;
  const g = { sig, frames: [], loop: null };
  g.w = u16(); g.h = u16();
  const packed = b[p++];
  g.gctFlag = !!(packed & 0x80);
  g.gctBits = packed & 7;
  g.bg = b[p++]; g.aspect = b[p++];
  if (g.gctFlag) { g.gctEntries = 1 << (g.gctBits + 1); p += g.gctEntries * 3; }
  let gce = null;
  for (let guard = 0; guard < 1e5; guard++) {
    const tag = b[p++];
    if (tag === 0x3B) { g.trailer = true; return g; }
    if (tag === 0x21) {
      const label = b[p++];
      if (label === 0xF9) {
        const len = b[p++];
        const pk = b[p++];
        gce = { disposal: (pk >> 2) & 7, transFlag: !!(pk & 1), delayCs: u16(), tIdx: b[p++] };
        p++; /* block terminator */
        if (len !== 4) throw new Error('bad GCE len');
      } else if (label === 0xFF) {
        const len = b[p++];
        const name = String.fromCharCode.apply(null, Array.from(b.slice(p, p + len)));
        p += len;
        const data = [];
        for (;;) { const n = b[p++]; if (!n) break; for (let i = 0; i < n; i++) data.push(b[p++]); }
        if (name === 'NETSCAPE2.0') g.loop = data[1] | (data[2] << 8);
      } else {
        for (;;) { const n = b[p++]; if (!n) break; p += n; }
      }
    } else if (tag === 0x2C) {
      const fr = { left: u16(), top: u16(), w: u16(), h: u16() };
      const ipk = b[p++];
      fr.lctFlag = !!(ipk & 0x80);
      if (fr.lctFlag) p += (1 << ((ipk & 7) + 1)) * 3;
      fr.minCode = b[p++];
      const lzw = [];
      for (;;) { const n = b[p++]; if (!n) break; for (let i = 0; i < n; i++) lzw.push(b[p++]); }
      fr.lzw = lzw;
      fr.gce = gce; gce = null;
      g.frames.push(fr);
    } else {
      throw new Error('unknown block 0x' + (tag || 0).toString(16) + ' at ' + (p - 1));
    }
  }
  throw new Error('no trailer');
}

/* ================= gfU16le ================= */
arrEq(GF.gfU16le(0x1234), [0x34, 0x12], 'u16le 0x1234');
arrEq(GF.gfU16le(0), [0, 0], 'u16le 0');
arrEq(GF.gfU16le(65535), [255, 255], 'u16le max');
arrEq(GF.gfU16le(-5), [0, 0], 'u16le clamps negative');
arrEq(GF.gfU16le(70000), [255, 255], 'u16le clamps overflow');

/* ================= gfDelayCs ================= */
eq(GF.gfDelayCs(100), 10, 'delay 100ms = 10cs');
eq(GF.gfDelayCs(0), 2, 'delay clamps to 2cs min');
eq(GF.gfDelayCs(15), 2, 'delay 15ms rounds then clamps');
eq(GF.gfDelayCs(1e9), 65535, 'delay clamps to u16 max');
eq(GF.gfDelayCs('250'), 25, 'delay coerces string');

/* ================= gfFit ================= */
arrEq([GF.gfFit(800, 600, 0).w, GF.gfFit(800, 600, 0).h], [800, 600], 'fit maxSide 0 = original');
arrEq([GF.gfFit(100, 50, 320).w, GF.gfFit(100, 50, 320).h], [100, 50], 'fit no upscale');
const ft = GF.gfFit(800, 600, 320);
arrEq([ft.w, ft.h], [320, 240], 'fit 800x600 -> 320x240');
const ft2 = GF.gfFit(600, 800, 320);
arrEq([ft2.w, ft2.h], [240, 320], 'fit portrait 600x800 -> 240x320');
eq(GF.gfFit(1, 1, 320).w, 1, 'fit 1x1 stays 1x1');

/* ================= gfSliceSheet ================= */
const sl = GF.gfSliceSheet(64, 16, 4, 1);
eq(sl.length, 4, 'slice 64x16 4x1 = 4 rects');
arrEq([sl[0].x, sl[0].y, sl[0].w, sl[0].h], [0, 0, 16, 16], 'slice rect 0');
arrEq([sl[3].x, sl[3].y], [48, 0], 'slice rect 3 offset');
const sl2 = GF.gfSliceSheet(30, 20, 3, 2);
eq(sl2.length, 6, 'slice 3x2 = 6 rects');
arrEq([sl2[4].x, sl2[4].y, sl2[4].w, sl2[4].h], [10, 10, 10, 10], 'slice row-major order');
eq(GF.gfSliceSheet(2, 2, 10, 10).length, 0, 'slice degenerate cell -> empty');

/* ================= gfChunkBytes ================= */
arrEq(GF.gfChunkBytes([]), [0], 'chunk empty = terminator only');
arrEq(GF.gfChunkBytes([9, 8, 7]), [3, 9, 8, 7, 0], 'chunk 3 bytes');
const big = new Array(600).fill(1);
const ch = GF.gfChunkBytes(big);
eq(ch.length, 600 + 3 + 1, 'chunk 600 bytes -> 3 sub-blocks + term');
eq(ch[0], 255, 'chunk first sub-block len 255');
eq(ch[256], 255, 'chunk second sub-block len 255');
eq(ch[512], 90, 'chunk third sub-block len 90');
eq(ch[ch.length - 1], 0, 'chunk ends with 0');

/* ================= gfPaletteBits ================= */
eq(GF.gfPaletteBits(2), 0, 'paletteBits 2 -> 0');
eq(GF.gfPaletteBits(3), 1, 'paletteBits 3 -> 1');
eq(GF.gfPaletteBits(4), 1, 'paletteBits 4 -> 1');
eq(GF.gfPaletteBits(5), 2, 'paletteBits 5 -> 2');
eq(GF.gfPaletteBits(16), 3, 'paletteBits 16 -> 3');
eq(GF.gfPaletteBits(17), 4, 'paletteBits 17 -> 4');
eq(GF.gfPaletteBits(256), 7, 'paletteBits 256 -> 7');
eq(GF.gfPaletteBits(0), 0, 'paletteBits 0 -> 0');

/* ================= gfQuantize ================= */
const q1 = GF.gfQuantize([[255, 0, 0], [0, 255, 0], [255, 0, 0]], 16);
eq(q1.length, 2, 'quantize keeps exact colors when few');
ok(q1.some(c => c[0] === 255 && c[1] === 0) && q1.some(c => c[1] === 255), 'quantize exact values preserved');
const shades = [];
for (let i = 0; i < 256; i++) shades.push([i, i, i]);
const q2 = GF.gfQuantize(shades, 8);
eq(q2.length, 8, 'quantize 256 grays -> 8 colors');
ok(q2.every(c => c.every(v => v >= 0 && v <= 255 && v === Math.round(v))), 'quantize output in byte range');
const q3 = GF.gfQuantize([], 16);
ok(q3.length >= 2, 'quantize empty input -> fallback palette');
const q4 = GF.gfQuantize(shades, 300);
ok(q4.length <= 256, 'quantize clamps maxColors to 256');

/* ================= gfNearest ================= */
const pal = [[0, 0, 0], [255, 255, 255], [255, 0, 0]];
eq(GF.gfNearest(pal, 0, 0, 0), 0, 'nearest exact black');
eq(GF.gfNearest(pal, 250, 250, 250), 1, 'nearest near-white');
eq(GF.gfNearest(pal, 200, 30, 30), 2, 'nearest reddish -> red');

/* ================= gfBayer ================= */
ok(GF.gfBayer(0, 0) === -0.5, 'bayer(0,0) = -0.5');
let bmin = 1, bmax = -1;
for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const v = GF.gfBayer(x, y); if (v < bmin) bmin = v; if (v > bmax) bmax = v; }
ok(bmin === -0.5 && bmax === 15 / 16 - 0.5, 'bayer range [-0.5, 0.4375]');
eq(GF.gfBayer(4, 4), GF.gfBayer(0, 0), 'bayer tiles with period 4');

/* ================= gfIndexFrame ================= */
const rgba = new Uint8ClampedArray([
  0, 0, 0, 255,     255, 255, 255, 255,
  255, 0, 0, 255,   0, 0, 0, 0
]);
const idx1 = GF.gfIndexFrame(rgba, 2, 2, pal, {});
arrEq(idx1, [0, 1, 2, 0], 'indexFrame maps without transparency (alpha ignored)');
const idx2 = GF.gfIndexFrame(rgba, 2, 2, pal, { transparentIndex: 3 });
arrEq(idx2, [0, 1, 2, 3], 'indexFrame maps alpha<128 to transparent index');
const idx3 = GF.gfIndexFrame(rgba, 2, 2, pal, { dither: true });
eq(idx3.length, 4, 'indexFrame dither returns full frame');
arrEq(GF.gfIndexFrame(rgba, 2, 2, pal, { dither: true }), idx3, 'indexFrame dither deterministic');

/* ================= gfLzwEncode round-trips ================= */
function roundTrip(indices, minCode, name) {
  const enc = GF.gfLzwEncode(indices, minCode);
  const dec = lzwDecode(enc, Math.max(2, minCode));
  arrEq(dec, indices, name + ' round-trip (' + indices.length + ' px -> ' + enc.length + ' bytes)');
  return enc;
}
arrEq(lzwDecode(GF.gfLzwEncode([], 2), 2), [], 'lzw empty stream');
roundTrip([0], 2, 'lzw single index');
roundTrip([0, 1, 2], 2, 'lzw tail-boundary [0,1,2]');
roundTrip([0, 1, 2, 3], 2, 'lzw code-growth boundary [0,1,2,3]');
roundTrip([1, 1, 1, 1, 1, 1, 1, 1], 2, 'lzw run of same index (KwKwK)');
roundTrip([0, 1, 0, 1, 0, 1, 0, 1, 0], 2, 'lzw alternating pattern');
const seq16 = [];
for (let i = 0; i < 5000; i++) seq16.push((i * 7 + (i >> 3)) % 16);
roundTrip(seq16, 4, 'lzw 5000-px 16-color pseudo-random');
const grad = [];
for (let i = 0; i < 20000; i++) grad.push((i * 13 + (i * i % 251)) % 256);
const encBig = roundTrip(grad, 8, 'lzw 20000-px 256-color (forces dict reset)');
ok(encBig.length < 20000 * 2, 'lzw output bounded');
const flat = new Array(10000).fill(5);
const encFlat = GF.gfLzwEncode(flat, 4);
ok(encFlat.length < 300, 'lzw compresses flat run hard (' + encFlat.length + ' bytes)');
arrEq(lzwDecode(encFlat, 4), flat, 'lzw flat run round-trip');
const enc2 = GF.gfLzwEncode([0, 1, 0, 1], 1);
arrEq(lzwDecode(enc2, 2), [0, 1, 0, 1], 'lzw minCodeSize clamped up to 2');

/* ================= gfBuildGif structure ================= */
const palette4 = [[0, 0, 0], [255, 0, 0], [0, 255, 0], [0, 0, 255]];
const fA = [0, 1, 2, 3, 0, 1, 2, 3, 3, 2, 1, 0];
const fB = [3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1];
const gif = GF.gfBuildGif({
  width: 4, height: 3, palette: palette4,
  frames: [{ indices: fA, delayCs: 10 }, { indices: fB, delayCs: 25 }],
  loop: 0
});
ok(gif instanceof Uint8Array, 'buildGif returns Uint8Array');
const pg = parseGif(gif);
eq(pg.sig, 'GIF89a', 'header GIF89a');
eq(pg.w, 4, 'LSD width 4');
eq(pg.h, 3, 'LSD height 3');
ok(pg.gctFlag, 'GCT flag set');
eq(pg.gctEntries, 4, 'GCT sized 4 for 4-color palette');
eq(pg.loop, 0, 'NETSCAPE loop = 0 (forever)');
eq(pg.frames.length, 2, 'two frames present');
eq(pg.frames[0].gce.delayCs, 10, 'frame1 delay 10cs');
eq(pg.frames[1].gce.delayCs, 25, 'frame2 delay 25cs');
ok(!pg.frames[0].gce.transFlag, 'no transparency flag when tIdx=-1');
eq(pg.frames[0].w, 4, 'image descriptor width');
ok(pg.trailer, 'trailer 0x3B present');
arrEq(lzwDecode(pg.frames[0].lzw, pg.frames[0].minCode), fA, 'frame1 pixel data round-trip');
arrEq(lzwDecode(pg.frames[1].lzw, pg.frames[1].minCode), fB, 'frame2 pixel data round-trip');

/* no-loop + transparency variant */
const gif2 = GF.gfBuildGif({
  width: 2, height: 2, palette: [[0, 0, 0], [255, 255, 255], [9, 9, 9]],
  frames: [{ indices: [0, 1, 2, 2], delayCs: 5 }],
  loop: null, transparentIndex: 2
});
const pg2 = parseGif(gif2);
eq(pg2.loop, null, 'loop:null omits NETSCAPE block');
ok(pg2.frames[0].gce.transFlag, 'transparency flag set');
eq(pg2.frames[0].gce.tIdx, 2, 'transparent index recorded');
eq(pg2.frames[0].gce.disposal, 2, 'disposal restore-bg with transparency');
eq(pg2.gctEntries, 4, 'GCT padded to pow2 (3 colors -> 4 entries)');
arrEq(lzwDecode(pg2.frames[0].lzw, pg2.frames[0].minCode), [0, 1, 2, 2], 'transparent frame round-trip');

/* 256-color full-size frame */
const bigPal = [];
for (let i = 0; i < 256; i++) bigPal.push([i, 255 - i, (i * 3) % 256]);
const bigIdx = [];
for (let i = 0; i < 64 * 64; i++) bigIdx.push((i * 31 + (i >> 5)) % 256);
const gif3 = GF.gfBuildGif({ width: 64, height: 64, palette: bigPal, frames: [{ indices: bigIdx, delayCs: 4 }], loop: 3 });
const pg3 = parseGif(gif3);
eq(pg3.gctEntries, 256, '256-entry GCT');
eq(pg3.loop, 3, 'finite loop count preserved');
eq(pg3.frames[0].minCode, 8, 'minCodeSize 8 for 256 colors');
arrEq(lzwDecode(pg3.frames[0].lzw, 8), bigIdx, '64x64 256-color frame round-trip');
ok(gif3.length < 64 * 64 + 256 * 3 + 2048, 'gif3 reasonably compressed (' + gif3.length + ' bytes)');

/* end-to-end: quantize -> index -> build -> parse -> decode */
const photo = [];
const photoRgba = [];
for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
  const r = x * 16, g = y * 16, b = ((x + y) * 8) % 256;
  photo.push([r, g, b]);
  photoRgba.push(r, g, b, 255);
}
const pal32 = GF.gfQuantize(photo, 32);
ok(pal32.length <= 32 && pal32.length >= 2, 'e2e quantize <=32 colors');
const eIdx = GF.gfIndexFrame(new Uint8ClampedArray(photoRgba), 16, 16, pal32, {});
ok(eIdx.every(v => v >= 0 && v < pal32.length), 'e2e all indices in palette range');
const eGif = GF.gfBuildGif({ width: 16, height: 16, palette: pal32, frames: [{ indices: eIdx, delayCs: 8 }], loop: 0 });
const ePg = parseGif(eGif);
arrEq(lzwDecode(ePg.frames[0].lzw, ePg.frames[0].minCode), eIdx, 'e2e full pipeline round-trip');

/* version */
eq(GF.version, '1.0.0', 'kernel version 1.0.0');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
