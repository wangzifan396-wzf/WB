
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.SigForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('gen').click();
const out=w.document.getElementById('out').value;
if(out.indexOf('<table')!==0){ console.error('no table output'); process.exit(1); }
if(w.document.getElementById('preview').innerHTML.indexOf('Zifan')<0){ console.error('preview missing'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
