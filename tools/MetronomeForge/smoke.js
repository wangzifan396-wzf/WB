
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.MetronomeForgePure){ console.error('pure missing'); process.exit(1); }
if(!w.document.getElementById('li0')){ console.error('lights missing'); process.exit(1); }
w.document.getElementById('tap').click();
w.document.getElementById('toggle').click();
console.log('PASS smoke');
process.exit(0);
