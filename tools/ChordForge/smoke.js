
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.ChordForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('run').click();
if(!w.document.getElementById('result').innerHTML.includes('maj7')){ console.error('chord result missing'); process.exit(1); }
if(!w.document.getElementById('piano').innerHTML.includes('div')){ console.error('piano missing'); process.exit(1); }
console.log('PASS smoke');
