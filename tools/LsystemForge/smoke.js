
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.LsystemForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('run').click();
if(!/^\d+$/.test(w.document.getElementById('segc').textContent) || Number(w.document.getElementById('segc').textContent)<1){
  console.error('no segments rendered'); process.exit(1);
}
console.log('PASS smoke');
