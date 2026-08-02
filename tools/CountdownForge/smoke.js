
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,url:'https://example.com/'});
const w=dom.window;
if(!w.CountdownForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('label').value='测试';
w.document.getElementById('target').value='2030-01-01T00:00';
w.document.getElementById('add').click();
if(w.document.getElementById('out').innerHTML.indexOf('天')<0){ console.error('countdown not added'); process.exit(1); }
if(!w.localStorage.getItem('countdown_list')){ console.error('not persisted'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
