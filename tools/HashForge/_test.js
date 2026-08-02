const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('sha256 abc', A.sha256('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
ok('sha256 empty', A.sha256('')==='e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
ok('sha256 fox', A.sha256('The quick brown fox jumps over the lazy dog')==='d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');
ok('sha256 56byte', A.sha256('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')==='248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
ok('sha1 abc', A.sha1('abc')==='a9993e364706816aba3e25717850c26c9cd0d89d');
ok('sha1 empty', A.sha1('')==='da39a3ee5e6b4b0d3255bfef95601890afd80709');
ok('sha1 fox', A.sha1('The quick brown fox jumps over the lazy dog')==='2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');
ok('md5 abc', A.md5('abc')==='900150983cd24fb0d6963f7d28e17f72');
ok('md5 empty', A.md5('')==='d41d8cd98f00b204e9800998ecf8427e');
ok('md5 fox', A.md5('The quick brown fox jumps over the lazy dog')==='9e107d9d372bb6826bd81d3542a419d6');
ok('digest sha256', A.digest('sha256','abc').value==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
ok('digest md5', A.digest('md5','abc').value==='900150983cd24fb0d6963f7d28e17f72');
ok('digest unknown', A.digest('xx','abc').error!==undefined);
ok('utf8 multibyte', A.sha256('\u4e2d\u6587')==='72726d8818f693066ceb69afa364218b692e62ea92b385782363780f47529c21');
ok('len sha256', A.sha256('hello world').length===64);
console.log('HashForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
