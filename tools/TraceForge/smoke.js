
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.TraceForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('out').innerHTML.indexOf('<svg')<0){ console.error('initial svg missing'); process.exit(1); }
if(w.document.getElementById('stat').textContent.indexOf('5 spans')<0){ console.error('stat wrong'); process.exit(1); }
w.document.getElementById('src').value='bad';
w.document.getElementById('render').click();
if(w.document.getElementById('stat').textContent.indexOf('解析失败')<0){ console.error('error msg missing'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
