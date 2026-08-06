
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var docs=[ {feats:["free","money","win"],cls:"spam"}, {feats:["free","prize"],cls:"spam"},
           {feats:["meeting","report","work"],cls:"ham"}, {feats:["meeting","boss"],cls:"ham"} ];
var mdl=A.nbTrain(docs);
ok('nb spam', A.nbPredict(mdl,["free","win"])==="spam");
ok('nb ham', A.nbPredict(mdl,["meeting","report"])==="ham");
var sc=A.nbScore(mdl,["free","win"]); ok('nb score bigger spam', sc.spam>sc.ham);
console.log('NaiveBayesForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
