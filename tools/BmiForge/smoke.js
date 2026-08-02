
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.BmiForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('out').innerHTML.indexOf('BMI')<0){ console.error('result missing'); process.exit(1); }
w.document.getElementById('demo').click();
if(w.document.getElementById('out').innerHTML.indexOf('体脂率')<0){ console.error('body fat not shown'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
