const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('toEsc A', A.toUnicodeEscape('A')==='\\u0041');
ok('toEsc CJK', A.toUnicodeEscape('\u4E2D')==='\\u4E2D');
ok('fromEsc A', A.fromUnicodeEscape('\\u0041')==='A');
ok('fromEsc CJK', A.fromUnicodeEscape('\\u4E2D')==='\u4E2D');
ok('fromEsc brace', A.fromUnicodeEscape('\\u{1F600}')==='\uD83D\uDE00');
ok('fromEsc hex x', A.fromUnicodeEscape('\\x41')==='A');
ok('esc roundtrip', A.fromUnicodeEscape(A.toUnicodeEscape('Hi\u4E2D'))==='Hi\u4E2D');
ok('codepoints A', A.toCodePoints('A')==='U+0041');
ok('codepoints astral', A.toCodePoints('\uD83D\uDE00')==='U+1F600');
ok('utf8 A', A.toUtf8Bytes('A')==='41');
ok('utf8 CJK', A.toUtf8Bytes('\u4E2D')==='E4 B8 AD');
ok('entities A', A.toHtmlEntities('A')==='&#65;');
ok('from entities dec', A.fromHtmlEntities('&#65;')==='A');
ok('from entities hex', A.fromHtmlEntities('&#x4E2D;')==='\u4E2D');
ok('entities roundtrip', A.fromHtmlEntities(A.toHtmlEntities('A\u4E2D'))==='A\u4E2D');
console.log('UnicodeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
