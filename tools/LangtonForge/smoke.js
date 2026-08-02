
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.LangtonForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('step').click();
if(w.document.getElementById('stat').textContent.indexOf('1 步')<0){ console.error('step failed'); process.exit(1); }
w.document.getElementById('restart').click();
console.log('PASS smoke');
process.exit(0);
