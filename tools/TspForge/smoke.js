
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.TspForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('solve').click();
if(!w.document.getElementById('stats').innerHTML.includes('2-opt')){ console.error('stats missing'); process.exit(1); }
console.log('PASS smoke');
