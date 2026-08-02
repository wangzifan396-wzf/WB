const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('initials one', A.initials('hello')==='H');
ok('initials two', A.initials('hello world')==='HW');
ok('initials empty', A.initials('')==='?');
ok('favicon text', A.faviconSvg('A',{emoji:false,bg:'#000',fg:'#fff'}).indexOf('>A<')>0);
ok('favicon emoji', A.faviconSvg('🚀',{emoji:true}).indexOf('🚀')>0);
ok('favicon svg', A.faviconSvg('X',{}).indexOf('<svg')===0);
ok('escapeXml', A.escapeXml('<a>&')==='&lt;a&gt;&amp;');
ok('colorFromText', A.colorFromText('abc').indexOf('hsl(')===0);
console.log('FaviconForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
