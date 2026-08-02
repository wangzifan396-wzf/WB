const { JSDOM } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,resources:'usable'});
dom.window.addEventListener('error',e=>errors.push(e.message||String(e.error)));
dom.window.onerror=(m)=>errors.push(m);
setTimeout(()=>{
  const doc=dom.window.document;
  const root=doc.getElementById('liveText');
  const glyphs=doc.getElementById('glyphs');
  if(!root){ console.error('FAIL: #liveText missing'); process.exit(1); }
  if(!glyphs||glyphs.children.length===0){ console.error('FAIL: glyph grid empty'); process.exit(1); }
  if(errors.length>0){ console.error('FAIL jsdom errors:',errors); process.exit(1); }
  console.log('SMOKE OK  jsdomError='+errors.length+'  glyphs='+glyphs.children.length+'  FontForgePure='+(typeof dom.window.FontForgePure));
  process.exit(0);
},800);
