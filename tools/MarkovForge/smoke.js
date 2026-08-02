
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.MarkovForgePure){ console.error('pure missing'); process.exit(1); }
if(!w.document.getElementById('out').value){ console.error('initial gen missing'); process.exit(1); }
if(w.document.getElementById('stat').textContent.indexOf('状态')<0){ console.error('stat missing'); process.exit(1); }
w.document.getElementById('src').value='短';
w.document.getElementById('gen').click();
if(w.document.getElementById('stat').textContent.indexOf('太短')<0){ console.error('short corpus msg missing'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
