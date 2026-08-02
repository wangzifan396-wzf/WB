
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.DocxForgePure){ console.error('pure missing'); process.exit(1); }
w.URL.createObjectURL = w.URL.createObjectURL || function(){ return 'blob:x'; };
w.document.getElementById('make').click();
const stat=w.document.getElementById('stat').textContent;
if(stat.indexOf('字节')<0){ console.error('make failed: '+stat); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
