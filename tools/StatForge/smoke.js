
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.StatForgePure){ console.error('pure missing'); process.exit(1); }
const out=w.document.getElementById('out').innerHTML;
if(out.indexOf('均值')<0 || out.indexOf('<svg')<0){ console.error('initial stats missing'); process.exit(1); }
w.document.getElementById('src').value='oops';
w.document.getElementById('run').click();
if(w.document.getElementById('out').innerHTML!=='' || w.document.getElementById('err').textContent===''){ console.error('bad input should error+clear'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
