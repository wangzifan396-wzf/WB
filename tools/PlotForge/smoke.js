
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.PlotForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('out').innerHTML.indexOf('<svg')<0){ console.error('initial plot missing'); process.exit(1); }
w.document.getElementById('expr').value='x^^2';
w.document.getElementById('draw').click();
if(w.document.getElementById('out').innerHTML.indexOf('<svg')>=0){ console.error('bad expr should clear'); process.exit(1); }
w.document.getElementById('expr').value='cos(x)';
w.document.getElementById('draw').click();
if(w.document.getElementById('stat').textContent.indexOf('cos(x)')<0){ console.error('redraw failed'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
