
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.SplitForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('out').innerHTML.indexOf('每人应付')<0){ console.error('result missing'); process.exit(1); }
w.document.getElementById('items').value='a 100\nb 50';
w.document.getElementById('run').click();
if(w.document.getElementById('out').innerHTML.indexOf('每人应付')<0){ console.error('recompute failed'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
