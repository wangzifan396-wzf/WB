
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var c=A.tooltipCss({});
  ok('tip content', c.indexOf('content: attr(data-tip);')>=0);
  ok('tip top', c.indexOf('bottom: calc(100% + 8px);')>=0);
  ok('tip hover', c.indexOf('.tooltip:hover::after')>=0);
  ok('tip bottom', A.tooltipCss({position:'bottom'}).indexOf('top: calc(100% + 8px);')>=0);
  ok('tip left', A.tooltipCss({position:'left'}).indexOf('right: calc(100% + 8px);')>=0);
  ok('tip right', A.tooltipCss({position:'right'}).indexOf('left: calc(100% + 8px);')>=0);
  ok('tip bg', A.tooltipCss({bg:'#000000'}).indexOf('background: #000000;')>=0);
  console.log(T.join('\n'));
  console.log('TIP_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
