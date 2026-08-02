
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.ImgConvertForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('conv').click();
if(w.document.getElementById('stat').textContent.indexOf('请先选择图片')<0){ console.error('empty guard failed'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
