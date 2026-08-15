
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.beautify('<div><p>Hi</p><span>x</span></div>');
ok('beautifyLines',b.split('\n').length>=4);
ok('beautifyIndent',b.indexOf('  <p>')>=0);
ok('void',A.beautify('<div><br><p>a</p></div>').indexOf('<br>')>=0);
ok('minify',A.minify('<div>  <p>Hi</p>  </div>')==='<div><p>Hi</p></div>');
ok('raw',A.minify('<style>  a{b}  </style><p>x</p>').indexOf('a{b}')>=0);
console.log('HtmlFormatForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
