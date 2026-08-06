
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var txt = A.buildRobots([{ua:"*", allow:["/"], disallow:["/admin"], crawlDelay:10, sitemap:"https://x.com/sitemap.xml"}]);
ok('ua', txt.indexOf("User-agent: *") >= 0);
ok('allow', txt.indexOf("Allow: /") >= 0);
ok('disallow', txt.indexOf("Disallow: /admin") >= 0);
ok('delay', txt.indexOf("Crawl-delay: 10") >= 0);
ok('sitemap', txt.indexOf("Sitemap: https://x.com/sitemap.xml") >= 0);
ok('empty skip', A.buildRobots([{ua:"*", allow:["", " "], disallow:["/x"]}]).indexOf("Allow:") < 0);
console.log('RobotsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
