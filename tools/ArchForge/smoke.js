
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.ArchForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('out').innerHTML.indexOf('<svg')<0){ console.error('initial svg missing'); process.exit(1); }
if(w.document.getElementById('stat').textContent.indexOf('节点')<0){ console.error('stat missing'); process.exit(1); }
w.document.getElementById('src').value='a -> b\nb -> a';
w.document.getElementById('render').click();
if(w.document.getElementById('stat').textContent.indexOf('循环')<0){ console.error('cycle msg missing'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
