
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.BrailleForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('gen').click();
const out=w.document.getElementById('out').textContent;
if(!out || out.charCodeAt(0)<0x2800){ console.error('no braille output'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
