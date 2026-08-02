
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.DitherForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('algo').value = 'bayer';
w.document.getElementById('run').click();
console.log('PASS smoke');
