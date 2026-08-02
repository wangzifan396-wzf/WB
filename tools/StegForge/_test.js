const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// utf8 codec
ok('utf8 ascii', A.sgUtf8Encode('A').join(',')==='65');
ok('utf8 cjk 3 bytes', A.sgUtf8Encode('中').join(',')==='228,184,173');
ok('utf8 emoji 4 bytes', A.sgUtf8Encode('\u{1F600}').length===4);
ok('utf8 roundtrip', A.sgUtf8Decode(A.sgUtf8Encode('Hi 中文 \u{1F600}'))==='Hi 中文 \u{1F600}');
ok('utf8 truncated null', A.sgUtf8Decode([0xE4,0xB8])===null);
// hide / reveal roundtrip
const h=A.sgHide('hello world', 'secret');
ok('hide ok', h.error===null);
ok('visible text unchanged', A.sgStrip(h.value)==='hello world');
ok('hidden is invisible chars only', h.value.length>'hello world'.length);
const rv=A.sgReveal(h.value);
ok('reveal roundtrip', rv.error===null && rv.value==='secret');
ok('cjk secret roundtrip', A.sgReveal(A.sgHide('封面文本','暗号：三十三').value).value==='暗号：三十三');
ok('emoji secret roundtrip', A.sgReveal(A.sgHide('cover','\u{1F511}key').value).value==='\u{1F511}key');
// errors
ok('empty cover error', A.sgHide('','x').error!==null);
ok('empty secret error', A.sgHide('c','').error!==null);
ok('double hide rejected', A.sgHide(h.value,'again').error!==null);
ok('reveal plain text error', A.sgReveal('nothing here').error!==null);
ok('reveal empty error', A.sgReveal('').error!==null);
ok('corrupt payload error', A.sgReveal('a\u200D\u200B\u2060b').error!==null);
// detect
const d=A.sgDetect(h.value);
ok('detect counts', d.zeroWidthCount==='secret'.length*8+2);
ok('detect payload flag', d.hasPayload===true);
ok('detect clean text', A.sgDetect('clean').zeroWidthCount===0 && A.sgDetect('clean').hasPayload===false);
ok('visible length', d.visibleLength===11);
ok('strip removes all', A.sgDetect(A.sgStrip(h.value)).zeroWidthCount===0);
console.log('StegForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
