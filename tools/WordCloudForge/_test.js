const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const tk=A.wcTokenize('Hello world hello WORLD code');
ok('tokenize lowercase', tk.value.join(',')==='hello,world,hello,world,code');
ok('tokenize empty error', A.wcTokenize('  ').error!==null);
ok('cjk sliding window', A.wcTokenize('思维导图').value.join(',')==='思维,维导,导图');
ok('cjk short kept', A.wcTokenize('词云').value.join(',')==='词云');
const c=A.wcCount(['x','apple','apple','banana','the','the','the']);
ok('count sorted desc', c[0].word==='apple' && c[0].count===2);
ok('stopword filtered', c.every(w=>w.word!=='the'));
ok('minLen filtered', c.every(w=>w.word!=='x'));
const c2=A.wcCount(['the','the','apple'],{stopwords:false});
ok('stopwords off', c2[0].word==='the' && c2[0].count===2);
ok('tie alphabetical', A.wcCount(['b','bb','aa'])[0].word==='aa');
const L=A.wcLayout([{word:'big',count:10},{word:'mid',count:5},{word:'tiny',count:1}]);
ok('layout ok', L.error===null && L.value.items.length===3);
ok('bigger word larger font', L.value.items[0].size>L.value.items[2].size);
ok('first at center', Math.abs(L.value.items[0].x-320)<1 && Math.abs(L.value.items[0].y-180)<1);
function overlap(a,b){ return a.bb.x<b.bb.x+b.bb.w && a.bb.x+a.bb.w>b.bb.x && a.bb.y<b.bb.y+b.bb.h && a.bb.y+a.bb.h>b.bb.y; }
ok('no overlaps', !overlap(L.value.items[0],L.value.items[1]) && !overlap(L.value.items[0],L.value.items[2]) && !overlap(L.value.items[1],L.value.items[2]));
ok('layout empty error', A.wcLayout([]).error!==null);
ok('equal counts same size', A.wcLayout([{word:'aa',count:3},{word:'bb',count:3}]).value.items.every(i=>i.size===24));
const s=A.wcSvg('alpha alpha alpha beta beta gamma');
ok('svg ok', s.error===null && s.value.indexOf('<svg')===0);
ok('svg contains top word', s.value.indexOf('alpha')>-1);
ok('esc', A.wcEsc('<&>')==='&lt;&amp;&gt;');
ok('svg empty error', A.wcSvg('').error!==null);
console.log('WordCloudForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
