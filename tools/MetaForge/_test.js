const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('esc amp', A.esc('a&b')==='a&amp;b');
ok('esc quote', A.esc('a"b')==='a&quot;b');
ok('esc lt', A.esc('<x>')==='&lt;x&gt;');
ok('metaTag', A.metaTag('description','hi')==='<meta name="description" content="hi">');
ok('ogTag', A.ogTag('og:title','T')==='<meta property="og:title" content="T">');
const out=A.buildMeta({title:'My Title',desc:'A description here',url:'https://x.com/',image:'https://x.com/i.png',siteName:'X',twitterHandle:'foo',ogType:'article',twitterCard:'summary',lang:'zh-CN'});
ok('has title tag', out.indexOf('<title>My Title</title>')>=0);
ok('has description', out.indexOf('name="description"')>=0);
ok('has og:type article', out.indexOf('content="article"')>=0);
ok('has og:url', out.indexOf('og:url')>=0);
ok('has og:locale', out.indexOf('zh_CN')>=0);
ok('twitter handle @', out.indexOf('@foo')>=0);
ok('twitter card', out.indexOf('content="summary"')>=0);
ok('esc in content', A.buildMeta({title:'A "B" & C'}).indexOf('A &quot;B&quot; &amp; C')>=0);
ok('empty title throws', (function(){ try{ A.buildMeta({title:''}); return false; }catch(e){ return true; } })());
ok('optional omitted', (function(){ var o=A.buildMeta({title:'T'}); return o.indexOf('og:image')<0 && o.indexOf('og:url')<0; })());
ok('warn long title', A.checkLengths({title:new Array(70).join('x'),desc:'a description long enough to pass the check here'}).length>=1);
ok('no warn ok', A.checkLengths({title:'Short',desc:new Array(60).join('x')}).length===0);
console.log('MetaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
