
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.PaletteForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('base').dispatchEvent(new w.Event('input'));
if(!/对比度/.test(w.document.getElementById('out').innerHTML)){ console.error('no contrast output'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
