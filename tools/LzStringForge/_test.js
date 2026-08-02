
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var a='hello world hello world hello world';
ok(typeof P.lzwCompress(a)==='string', 'compress returns string');
ok(P.lzwDecompress(P.lzwCompress(a))===a, 'roundtrip a');
var b='nano-tools 单文件工具集零依赖本地优先 nano-tools 单文件工具集零依赖本地优先';
ok(P.lzwDecompress(P.lzwCompress(b))===b, 'roundtrip unicode');
ok(P.lzwDecompress(P.lzwCompress(''))==='', 'empty roundtrip');
var c='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
ok(P.lzwDecompress(P.lzwCompress(c))===c, 'roundtrip alphanumeric');
var big=''; for(var q=0;q<400;q++) big+='nano-tools zero-dependency offline ';
ok(P.lzwDecompress(P.lzwCompress(big))===big, 'roundtrip long repetitive');
ok(P.lzRatio(big, P.lzwCompress(big))>50, 'ratio >50% on long repetitive input');
ok(P.utf8Encode('\u4e2d').length===3, 'utf8 encode 3 bytes for CJK');
console.log('LzStringForge _test: '+n+' passed, 0 failed');
