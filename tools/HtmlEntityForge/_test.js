const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('encode &', A.encode('&').value==='&amp;');
ok('encode <', A.encode('<').value==='&lt;');
ok('encode >', A.encode('>').value==='&gt;');
ok('encode "', A.encode('"').value==='&quot;');
ok('ascii passthrough', A.encode('a').value==='a');
ok('decode <', A.decode('&lt;').value==='<');
ok('decode &', A.decode('&amp;').value==='&');
ok('roundtrip script', A.decode(A.encode('<script>').value).value==='<script>');
ok('encode decimal', A.encode('<',{mode:'decimal'}).value==='&#60;');
ok('encode hex', A.encode('<',{mode:'hex'}).value==='&#x3c;');
ok('decode decimal', A.decode('&#60;').value==='<');
ok('decode hex', A.decode('&#x3c;').value==='<');
ok('decode unknown kept', A.decode('&zzz;').value==='&zzz;');
ok('encode named copy', A.encode('\u00a9').value==='&copy;');
ok('decode named copy', A.decode('&copy;').value==='\u00a9');
ok('decode plain', A.decode('AT&T').value==='AT&T');
console.log('HtmlEntityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
