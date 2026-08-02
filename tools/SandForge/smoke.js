
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.SandForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('play').click();
w.document.getElementById('clear').click();
console.log('PASS smoke');
process.exit(0);
