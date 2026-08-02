
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.SpiroForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('kind').value = 'epi';
w.document.getElementById('draw').click();
if(!w.document.getElementById('out').innerHTML.includes('<svg')){ console.error('no svg rendered'); process.exit(1); }
console.log('PASS smoke');
