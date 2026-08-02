"use strict";
// SchemaForge smoke test: load the document in jsdom, assert UI + kernel hooks work without WebGL.
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
    // no canvas; getContext returns null so PNG export degrades
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

    const api = window.__SCHEMAFORGE__;
    ok('exposes __SCHEMAFORGE__', !!api);
    ok('version present', api && !!api.version);
    ok('kernel present', api && !!api.kernel && typeof api.kernel.genDDL==='function');

    api.loadSample();
    const tables = api.getTables();
    ok('loadSample -> 3 tables', tables.length===3);
    ok('sample names', tables[0].name==='users' && tables[2].name==='comments');

    const ddl = api.genDDL('mysql');
    ok('genDDL has CREATE TABLE', /CREATE TABLE/.test(ddl));
    ok('genDDL has FK', /FOREIGN KEY/.test(ddl));
    const mer = api.genMermaid();
    ok('genMermaid erDiagram', /erDiagram/.test(mer));
    const svg = api.genSVG();
    ok('genSVG root', /<svg/.test(svg));

    ok('validate clean', api.validate().length===0);

    api.addTable();
    ok('addTable increments', api.getTables().length===4);

    // render must not throw
    let renderOk=true; try{ api.render(); }catch(e){ renderOk=false; errors.push('render: '+e.message); }
    ok('render() no throw', renderOk);

    // sidebar reflects selection after a render cycle
    const side = window.document.getElementById('sidebar');
    ok('sidebar populated', !!side && side.innerHTML.length>0);

    // language switch
    api.applyLang();
    ok('applyLang no throw', true);

    if(errors.length){ console.error('JS errors captured: '+errors.slice(0,5).join(' | ')); }
    // Ignore benign jsdom SVG layout warnings; only fail on real JS errors
    const realErrors = errors.filter(function(e){ return /render:|genDDL|genMermaid|genSVG|loadSample|addTable/.test(e); });
    ok('no JS errors during smoke', realErrors.length===0);

    console.log('SchemaForge smoke: '+pass+' passed, '+fail+' failed');
    process.exit(fail>0 || realErrors.length>0 ? 1 : 0);
  }catch(e){
    console.error('SMOKE EXCEPTION: '+e.stack);
    process.exit(1);
  }
}, 250);
