/* MeshForge kernel tests - run with: node _test.js */
"use strict";
var fs = require("fs");
var path = require("path");

var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
var m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("FATAL: no <script> block found"); process.exit(1); }

var mod = { exports: {} };
new Function("module", "exports", "require", m[1])(mod, mod.exports, require);
var MF = mod.exports;

var pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; }
  else { fail++; console.error("  FAIL: " + name); }
}
function near(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-5); }

/* ---------- exports ---------- */
ok(MF && MF.version === "1.0.0", "MF.version");
["mfVec3Sub","mfVec3Cross","mfVec3Dot","mfVec3Normalize","mfMat4Identity","mfMat4Multiply",
 "mfMat4Perspective","mfMat4LookAt","mfNormalMatrix","mfOrbitEye","mfAabb","mfComputeNormals",
 "mfFitDistance","mfEdges","mfTorus","mfCube","mfParseOBJ","mfParseSTL","mfParseAsciiStl",
 "mfIsAsciiStl","mfFormatSize","mfMat4Translate","mfMat4Scale","mfMat4RotateX","mfMat4RotateY"
].forEach(function (k) { ok(typeof MF[k] === "function", "export " + k); });

/* ---------- vec3 ---------- */
ok(JSON.stringify(MF.mfVec3Sub([3,2,1],[1,1,1])) === "[2,1,0]", "vec3 sub");
ok(JSON.stringify(MF.mfVec3Cross([1,0,0],[0,1,0])) === "[0,0,1]", "cross x*y=z");
ok(MF.mfVec3Dot([1,2,3],[4,5,6]) === 32, "dot");
var nv = MF.mfVec3Normalize([3,0,4]);
ok(near(nv[0],0.6) && near(nv[2],0.8), "normalize 3-4-5");
ok(JSON.stringify(MF.mfVec3Normalize([0,0,0])) === "[0,0,0]", "normalize zero vec safe");

/* ---------- mat4 ---------- */
var I = MF.mfMat4Identity();
ok(I[0]===1 && I[5]===1 && I[10]===1 && I[15]===1 && I[1]===0, "identity");
var T = MF.mfMat4Translate(2,3,4);
var TI = MF.mfMat4Multiply(T, I);
ok(TI[12]===2 && TI[13]===3 && TI[14]===4, "T*I = T");
var S = MF.mfMat4Scale(2);
var TS = MF.mfMat4Multiply(T, S); /* scale then translate */
ok(TS[0]===2 && TS[12]===2, "T*S composition");
/* rotate y by 90deg: +x axis -> -z (column-major: transform [1,0,0]) */
var RY = MF.mfMat4RotateY(Math.PI/2);
ok(near(RY[0],0) && near(RY[2],-1) && near(RY[8],1) && near(RY[10],0), "rotateY 90");
var RX = MF.mfMat4RotateX(Math.PI/2);
ok(near(RX[5],0) && near(RX[6],1) && near(RX[9],-1), "rotateX 90");
var P = MF.mfMat4Perspective(Math.PI/2, 1, 0.1, 100);
ok(near(P[5],1) && P[11]===-1 && P[15]===0, "perspective structure");
ok(near(P[0], P[5]/1), "perspective aspect=1");
/* lookAt from +z toward origin: eye-space z of origin should be -dist */
var V = MF.mfMat4LookAt([0,0,5],[0,0,0],[0,1,0]);
/* transform origin: out = V * [0,0,0,1] = translation column */
ok(near(V[12],0) && near(V[13],0) && near(V[14],-5), "lookAt translates origin to -5z");
/* normal matrix of pure rotation == rotation upper3x3 */
var NM = MF.mfNormalMatrix(RY);
ok(near(NM[0],RY[0]) && near(NM[2],RY[2]) && near(NM[6],RY[8]) && near(NM[8],RY[10]), "normalMatrix(rotation)=rotation3x3");
/* normal matrix of uniform scale s -> 1/s on diagonal */
var NS = MF.mfNormalMatrix(MF.mfMat4Scale(2));
ok(near(NS[0],0.5) && near(NS[4],0.5) && near(NS[8],0.5), "normalMatrix(scale2)=0.5I");
/* singular matrix falls back to identity */
var Z = new Float32Array(16);
var NZ = MF.mfNormalMatrix(Z);
ok(NZ[0]===1 && NZ[4]===1 && NZ[8]===1, "normalMatrix(singular)=I");

/* ---------- orbit ---------- */
var eye = MF.mfOrbitEye(0, 0, 5, [0,0,0]);
ok(near(eye[0],0) && near(eye[1],0) && near(eye[2],5), "orbit theta=0 -> +z");
eye = MF.mfOrbitEye(Math.PI/2, 0, 5, [0,0,0]);
ok(near(eye[0],5) && near(eye[2],0), "orbit theta=90 -> +x");
eye = MF.mfOrbitEye(0, Math.PI/2, 5, [1,2,3]);
ok(near(eye[1], 2+5) && near(eye[0],1), "orbit phi=90 -> up, with target offset");

/* ---------- aabb / normals / fit ---------- */
var tri = new Float32Array([0,0,0, 2,0,0, 0,4,0]);
var box = MF.mfAabb(tri);
ok(box.min[0]===0 && box.max[0]===2 && box.max[1]===4, "aabb min/max");
ok(near(box.center[0],1) && near(box.center[1],2), "aabb center");
ok(near(box.radius, Math.sqrt(4+16)/2), "aabb radius");
var emptyBox = MF.mfAabb(new Float32Array(0));
ok(emptyBox.radius === 0, "aabb empty safe");
var nrm = MF.mfComputeNormals(tri);
ok(near(nrm[2],1) && near(nrm[5],1) && near(nrm[8],1), "flat normal +z (ccw)");
ok(MF.mfFitDistance(0, Math.PI/4) === 3, "fitDistance zero radius fallback");
ok(MF.mfFitDistance(1, Math.PI/2) > 1.5 && MF.mfFitDistance(1, Math.PI/2) < 1.7, "fitDistance fov90 ~ 1.63");

/* ---------- edges ---------- */
var edges = MF.mfEdges(tri);
ok(edges.length === 18, "edges: 1 tri -> 3 segments (18 floats)");
ok(edges[0]===0 && edges[3]===2, "edge0 = v0->v1");

/* ---------- samples ---------- */
var torus = MF.mfTorus(1, 0.4, 8, 6);
ok(torus.triangleCount === 8*6*2, "torus tri count");
ok(torus.positions.length === torus.vertexCount*3, "torus positions size");
ok(torus.normals.length === torus.positions.length, "torus normals size");
var tb = MF.mfAabb(torus.positions);
ok(near(tb.max[0], 1.4, 0.05), "torus x bound ~ R+r");
/* segV=4 samples tv=90deg exactly -> y bound = r */
var torus4 = MF.mfTorus(1, 0.4, 8, 4);
var tb4 = MF.mfAabb(torus4.positions);
ok(near(tb4.max[1], 0.4, 1e-4), "torus y bound = r (segV=4)");
/* torus normals should be unit length */
var nl = Math.sqrt(torus.normals[0]*torus.normals[0]+torus.normals[1]*torus.normals[1]+torus.normals[2]*torus.normals[2]);
ok(near(nl,1,1e-4), "torus normal unit");
var cube = MF.mfCube(2);
ok(cube.triangleCount === 12 && cube.vertexCount === 36, "cube 12 tris / 36 verts");
var cb = MF.mfAabb(cube.positions);
ok(cb.min[0]===-1 && cb.max[2]===1, "cube bounds +-1");

/* ---------- OBJ parser ---------- */
var objSrc = [
  "# comment",
  "v 0 0 0", "v 1 0 0", "v 1 1 0", "v 0 1 0",
  "vn 0 0 1",
  "f 1//1 2//1 3//1 4//1", /* quad with normals -> 2 tris */
  ""
].join("\n");
var om = MF.mfParseOBJ(objSrc);
ok(om.triangleCount === 2, "obj quad -> 2 tris (fan)");
ok(om.vertexCount === 6, "obj 6 emitted verts");
ok(om.declaredVertices === 4 && om.declaredFaces === 2, "obj declared counts");
ok(near(om.normals[2],1), "obj uses provided vn");
ok(om.source === "obj", "obj source tag");
/* no normals -> computed flat */
var om2 = MF.mfParseOBJ("v 0 0 0\nv 2 0 0\nv 0 4 0\nf 1 2 3");
ok(om2.triangleCount === 1 && near(om2.normals[2],1), "obj auto flat normals");
/* negative indices */
var om3 = MF.mfParseOBJ("v 0 0 0\nv 1 0 0\nv 0 1 0\nf -3 -2 -1");
ok(om3.triangleCount === 1 && om3.positions[3]===1, "obj negative indices");
/* v/vt/vn form */
var om4 = MF.mfParseOBJ("v 0 0 0\nv 1 0 0\nv 0 1 0\nvt 0 0\nvn 0 0 1\nf 1/1/1 2/1/1 3/1/1");
ok(om4.triangleCount === 1 && near(om4.normals[2],1), "obj v/vt/vn form");
/* windows line endings + trailing garbage */
var om5 = MF.mfParseOBJ("v 0 0 0\r\nv 1 0 0\r\nv 0 1 0\r\nf 1 2 3\r\nusemtl foo\r\n");
ok(om5.triangleCount === 1, "obj CRLF + ignored keywords");
ok(MF.mfParseOBJ("").triangleCount === 0, "obj empty input safe");

/* ---------- binary STL round trip ---------- */
function buildBinaryStl(tris) {
  var buf = new ArrayBuffer(84 + tris.length * 50);
  var dv = new DataView(buf);
  dv.setUint32(80, tris.length, true);
  var off = 84;
  tris.forEach(function (t) {
    for (var i = 0; i < 3; i++) dv.setFloat32(off + i*4, t.n[i], true);
    for (var v = 0; v < 3; v++)
      for (var c = 0; c < 3; c++)
        dv.setFloat32(off + 12 + v*12 + c*4, t.v[v][c], true);
    dv.setUint16(off + 48, 0, true);
    off += 50;
  });
  return buf;
}
var stlBuf = buildBinaryStl([
  { n: [0,0,1], v: [[0,0,0],[1,0,0],[0,1,0]] },
  { n: [0,0,0], v: [[0,0,1],[2,0,1],[0,2,1]] } /* zero normal -> auto compute */
]);
var sm = MF.mfParseSTL(stlBuf);
ok(sm.triangleCount === 2 && sm.source === "stl-binary", "stl binary parse");
ok(near(sm.normals[2],1), "stl declared normal kept");
ok(near(sm.normals[9+2],1), "stl zero normal recomputed");
ok(sm.positions[9+3]===2, "stl vertex data");
/* Uint8Array input path */
var sm2 = MF.mfParseSTL(new Uint8Array(stlBuf));
ok(sm2.triangleCount === 2, "stl accepts Uint8Array");
/* truncated */
var threw = false;
try { MF.mfParseSTL(new Uint8Array(stlBuf, 0, 90)); } catch (e) { threw = true; }
ok(threw, "stl truncated body throws");

/* ---------- ASCII STL ---------- */
var asciiStl = [
  "solid demo",
  " facet normal 0 0 1",
  "  outer loop",
  "   vertex 0 0 0", "   vertex 1 0 0", "   vertex 0 1 0",
  "  endloop",
  " endfacet",
  " facet normal 0 0 0",
  "  outer loop",
  "   vertex 0 0 2", "   vertex 3 0 2", "   vertex 0 3 2",
  "  endloop",
  " endfacet",
  "endsolid demo"
].join("\n");
var am = MF.mfParseAsciiStl(asciiStl);
ok(am.triangleCount === 2 && am.source === "stl-ascii", "ascii stl parse");
ok(near(am.normals[9+2],1), "ascii stl zero normal recomputed");
/* autodetect via bytes */
var asciiBytes = new Uint8Array(asciiStl.length);
for (var i = 0; i < asciiStl.length; i++) asciiBytes[i] = asciiStl.charCodeAt(i);
ok(MF.mfIsAsciiStl(asciiBytes) === true, "ascii detect true");
ok(MF.mfIsAsciiStl(new Uint8Array(stlBuf)) === false, "binary detect false");
var auto = MF.mfParseSTL(asciiBytes);
ok(auto.triangleCount === 2 && auto.source === "stl-ascii", "parseSTL autodetects ascii");
/* binary starting with 'solid' but not ascii */
var trick = new Uint8Array(buildBinaryStl([{ n:[0,0,1], v:[[0,0,0],[1,0,0],[0,1,0]] }]));
trick[0]=115; trick[1]=111; trick[2]=108; trick[3]=105; trick[4]=100; /* 'solid' */
var tm = MF.mfParseSTL(trick);
ok(tm.source === "stl-binary" && tm.triangleCount === 1, "binary with 'solid' header still binary");

/* ---------- e2e: obj -> aabb -> fit -> matrices pipeline ---------- */
var mesh = MF.mfParseOBJ("v -1 -1 -1\nv 1 -1 -1\nv 1 1 -1\nv -1 1 -1\nf 1 2 3 4");
var bb = MF.mfAabb(mesh.positions);
var dist = MF.mfFitDistance(bb.radius, Math.PI/4);
var eyeP = MF.mfOrbitEye(0.7, 0.4, dist, bb.center);
var view2 = MF.mfMat4LookAt(eyeP, bb.center, [0,1,0]);
var proj2 = MF.mfMat4Perspective(Math.PI/4, 16/9, 0.01, 100);
var mvp = MF.mfMat4Multiply(proj2, view2);
ok(mvp.length === 16 && isFinite(mvp[0]) && isFinite(mvp[15]), "e2e pipeline finite mvp");
ok(dist > bb.radius, "e2e fit distance beyond radius");
ok(MF.mfFormatSize(bb.size) === "2 x 2 x 0", "formatSize");

/* ---------- edges of torus consistent ---------- */
var te = MF.mfEdges(torus.positions);
ok(te.length === torus.triangleCount * 18, "torus edges size");

console.log("MeshForge tests: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
