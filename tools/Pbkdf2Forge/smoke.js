const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true, url:'https://example.com/'});
const w=dom.window;
if(!w.Pbkdf2ForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.body.innerHTML.indexOf('Pbkdf2Forge')<0){ console.error('initial output missing'); process.exit(1); }
console.log('PASS smoke'); process.exit(0);
