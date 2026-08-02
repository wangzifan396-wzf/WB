
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.WorldClockForgePure){ console.error('pure missing'); process.exit(1); }
const out=w.document.getElementById('out').innerHTML;
if(out.indexOf('UTC')<0 || out.indexOf(':')<0){ console.error('clocks not rendered'); process.exit(1); }
w.document.getElementById('add').click();
if(w.document.getElementById('out').innerHTML.indexOf('Europe')<0){ console.error('add zone failed'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
