
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.WordleForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('guess').value='CRANE';
w.document.getElementById('submit').click();
const s=w.document.getElementById('stat').textContent;
if(s.indexOf('还剩')<0 && s.indexOf('胜利')<0){ console.error('submit failed: '+s); process.exit(1); }
w.document.getElementById('restart').click();
console.log('PASS smoke');
process.exit(0);
