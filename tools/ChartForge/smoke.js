"use strict";
// ChartForge smoke test: jsdom, canvas getContext returns null (headless degrade).
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://example.com/',
  beforeParse(window){
    window.requestAnimationFrame = function(cb){ return setTimeout(function(){ cb(Date.now()); }, 0); };
    window.cancelAnimationFrame = function(id){ clearTimeout(id); };
    if(window.HTMLCanvasElement){
      window.HTMLCanvasElement.prototype.getContext = function(){ return null; };
    }
    window.addEventListener('error', function(e){ errors.push(String(e.error||e.message)); });
    const orig = window.console.error;
    window.console.error = function(){ errors.push(Array.prototype.join.call(arguments,' ')); };
  }
});
const { window } = dom;
setTimeout(function(){
  try{
    let pass=0, fail=0;
    function ok(n,c){ if(c) pass++; else { fail++; console.error('SMOKE FAIL: '+n); } }
    const api = window.__CHARTFORGE__;
    ok('exposes __CHARTFORGE__', !!api);
    ok('version present', api && !!api.version);
    ok('kernel present', api && typeof api.kernel.buildScene==='function');
    // sample loaded on init; stats computed
    const data = api.getLastData();
    ok('sample data parsed', data && data.rows.length===4);
    ok('numeric col detected', api.kernel.isNumericCol(data.rows,1)===true);
    // draw() runs without throwing even with null canvas ctx
    let drawOk=true; try{ api.draw(); }catch(e){ drawOk=false; errors.push('draw: '+e.message); }
    ok('draw() no throw', drawOk);
    // exportSVG builds without throwing (uses lastData)
    let svgOk=true; try{ api.exportSVG(); }catch(e){ svgOk=false; errors.push('exportSVG: '+e.message); }
    ok('exportSVG no throw', svgOk);
    // language switch
    let langOk=true; try{ api.applyLang(); }catch(e){ langOk=false; }
    ok('applyLang no throw', langOk);
    if(errors.length){ console.error('JS errors: '+errors.slice(0,5).join(' | ')); }
    const realErrors = errors.filter(function(e){ return /draw:|exportSVG|buildScene/.test(e); });
    ok('no JS errors', realErrors.length===0);
    console.log('ChartForge smoke: '+pass+' passed, '+fail+' failed');
    process.exit(fail>0 || realErrors.length>0 ? 1 : 0);
  }catch(e){
    console.error('SMOKE EXCEPTION: '+e.stack);
    process.exit(1);
  }
}, 250);
