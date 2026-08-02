const { JSDOM } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true});
const {window}=dom; const errs=[]; window.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{ const doc=window.document; let pass=0,fail=0;
  const ok=(n,c)=>c?pass++:(fail++,console.error('  FAIL: '+n));
  ok('TimerForgePure exposed', typeof window.TimerForgePure==='object');
  doc.getElementById('cdSet').value='00:05'; doc.getElementById('cdStart').click();
  ok('cd updated', doc.getElementById('cd').textContent!=='00:00');
  doc.getElementById('swStart').click();
  setTimeout(()=>{
    ok('sw updated', doc.getElementById('sw').textContent!=='00:00.0');
    ok('no js errors', errs.length===0);
    if(errs.length) console.error('  js errors:',errs);
    console.log('TimerForge smoke: '+pass+' passed, '+fail+' failed');
    process.exit(fail?1:0);
  },300);
},400);
