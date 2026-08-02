
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.GomokuForgePure){ console.error('pure missing'); process.exit(1); }
var circles=w.document.querySelectorAll('#board circle');
// simulate a human click at center
var svg=w.document.getElementById('board');
svg.getBoundingClientRect = function(){ return {left:0, top:0, width:450, height:450, right:450, bottom:450}; };
svg.dispatchEvent(new w.MouseEvent('click',{clientX:225, clientY:225, bubbles:true}));
var after=w.document.querySelectorAll('#board circle').length;
if(after<2){ console.error('move did not place stones: '+after); process.exit(1); }
console.log('PASS smoke');
