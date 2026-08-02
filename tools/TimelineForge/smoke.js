
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.TimelineForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('out').innerHTML.indexOf('<svg')<0){ console.error('initial svg missing'); process.exit(1); }
if(w.document.getElementById('stat').textContent.indexOf('5 个事件')<0){ console.error('stat wrong'); process.exit(1); }
w.document.getElementById('src').value='oops';
w.document.getElementById('render').click();
if(w.document.getElementById('out').innerHTML.indexOf('<svg')>=0){ console.error('bad input should clear'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
