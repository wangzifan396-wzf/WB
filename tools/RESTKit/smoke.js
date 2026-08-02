const jsdomLib = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const { JSDOM, VirtualConsole } = jsdomLib;
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
// jsdom does not implement canvas / matchMedia / observers / blob download — ignore that noise.
const IGNORE=/Not implemented|getContext|createObjectURL|revokeObjectURL|HTMLCanvasElement|canvas|matchMedia|scrollIntoView|IntersectionObserver|ResizeObserver|Blob|requestAnimationFrame|download|clipboard/i;
const errs=[];
const vc=new VirtualConsole();
vc.on('jsdomError', e => { const msg=(e && (e.message||String(e)))||''; if(!IGNORE.test(msg)) errs.push(msg); });
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
const {window}=dom;
window.addEventListener('error', e => { const msg=(e && e.message)||''; if(!IGNORE.test(msg)) errs.push(msg); });
setTimeout(()=>{
  const doc=window.document; let pass=0,fail=0;
  const ok=(n,c)=>c?pass++:(fail++,console.error('  FAIL: '+n));
  ok('document body present', !!doc.body);
  const ctrls=doc.querySelectorAll('button,input,textarea,select,[contenteditable]');
  ok('has interactive controls', ctrls.length>0);
  const pureKeys=Object.keys(window).filter(k=>/Pure$/.test(k));
  if(pureKeys.length) ok('Pure global is object', typeof window[pureKeys[0]]==='object');
  ok('no real js errors', errs.length===0);
  if(errs.length) console.error('  js errors:', errs);
  const tool=path.basename(__dirname);
  console.log(tool+' smoke: '+pass+' passed, '+fail+' failed');
  process.exit(fail?1:0);
},500);
