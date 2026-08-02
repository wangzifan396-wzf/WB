
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.TuringForgePure){ console.error('pure missing'); process.exit(1); }
// run via UI
w.document.getElementById('run').click();
const out = w.document.getElementById('out').textContent;
if(!/接受/.test(out)){ console.error('run did not accept: '+out); process.exit(1); }
const tape = w.document.getElementById('tape').textContent;
if(!tape){ console.error('tape empty'); process.exit(1); }
console.log('PASS smoke');
