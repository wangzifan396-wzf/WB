
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.DagForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('topo').value.indexOf('lint')<0){ console.error('topo missing'); process.exit(1); }
if(w.document.getElementById('crit').value.indexOf('deploy')<0){ console.error('crit missing'); process.exit(1); }
if(w.document.getElementById('stat').textContent.indexOf('总工期 15')<0){ console.error('total wrong: '+w.document.getElementById('stat').textContent); process.exit(1); }
w.document.getElementById('src').value='a -> b\nb -> a';
w.document.getElementById('run').click();
if(w.document.getElementById('stat').textContent.indexOf('环')<0){ console.error('cycle msg missing'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
