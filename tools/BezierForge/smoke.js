
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.BezierForgePure){ console.error('pure missing'); process.exit(1); }
var cps=w.document.querySelectorAll('#cv .cp');
if(cps.length!==4){ console.error('expected 4 control points, got '+cps.length); process.exit(1); }
w.document.getElementById('copy').click();
console.log('PASS smoke');
