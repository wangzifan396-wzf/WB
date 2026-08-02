
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.PomodoroForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('clock').textContent!=='25:00'){ console.error('initial clock wrong'); process.exit(1); }
w.document.getElementById('toggle').click();
if(w.document.getElementById('toggle').textContent!=='暂停'){ console.error('toggle failed'); process.exit(1); }
w.document.getElementById('skip').click();
if(w.document.getElementById('stat').textContent.indexOf('1 个番茄')<0){ console.error('skip failed'); process.exit(1); }
w.document.getElementById('reset').click();
if(w.document.getElementById('clock').textContent!=='25:00'){ console.error('reset failed'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
