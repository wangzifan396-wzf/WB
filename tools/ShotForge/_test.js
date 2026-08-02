const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const code='function hi(name){ // greet\n  return "Hi "+name;\n}';
const toks=A.tokenizeToTokens(code,'js');
ok('tokens array', Array.isArray(toks) && toks.length>3);
ok('keyword classified', toks.some(function(t){return t.c==='kw'&&t.t==='function';}));
ok('string classified', toks.some(function(t){return t.c==='str';}));
ok('comment classified', toks.some(function(t){return t.c==='com';}));
ok('function name fn', toks.some(function(t){return t.c==='fn'&&t.t==='hi';}));
const py=A.tokenizeToTokens('x = 1 # note','py');
ok('python hash comment', py.some(function(t){return t.c==='com';}));
ok('escapeXml amp', A.escapeXml('a&b')==='a&amp;b');
ok('escapeXml lt', A.escapeXml('<x>')==='&lt;x&gt;');
const svg=A.svgFromTokens(toks,{bg:'#0d1117',title:'t.js'});
ok('svg root', svg.indexOf('<svg')===0 && svg.indexOf('</svg>')>0);
ok('svg has text', svg.indexOf('<text')>0);
ok('svg has tspan', svg.indexOf('<tspan')>0);
ok('svg title', svg.indexOf('t.js')>0);
const html2=A.htmlFromTokens(toks);
ok('html has span', html2.indexOf('<span')!==-1);
console.log('ShotForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
