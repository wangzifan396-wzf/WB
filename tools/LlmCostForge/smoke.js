const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true, url:'https://example.com/'});
const w=dom.window;
if(!w.LlmCostForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.body.innerHTML.indexOf('每月（30 天）')<0){ console.error('initial output missing'); process.exit(1); }
console.log('PASS smoke'); process.exit(0);
