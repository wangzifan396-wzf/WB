/* Node test: extract first <script> from index.html, run pure fns, assert. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('NO SCRIPT FOUND'); process.exit(1); }
const fn = new Function('module', 'exports', 'require', m[1]);
fn(module, module.exports, require);
const A = module.exports;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond) pass++; else { fail++; console.error('  FAIL: ' + name); } }

// PRNG deterministic
var r1=A.mulberry32(7), r2=A.mulberry32(7);
ok('prng deterministic', r1()===r2() && r1()===r2());

// generate deterministic for same seed
var a=A.generate({seed:42, paragraphs:2, sentencesPerParagraph:3, wordsPerSentence:6});
var b=A.generate({seed:42, paragraphs:2, sentencesPerParagraph:3, wordsPerSentence:6});
ok('generate deterministic', a===b);

// paragraph count
ok('paragraph count', a.split('\n\n').length === 2);

// lorem start
ok('start with lorem', A.generate({seed:1, paragraphs:1, sentencesPerParagraph:2, startWithLorem:true}).startsWith('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'));

// no lorem start
ok('no lorem start', !A.generate({seed:1, paragraphs:1, sentencesPerParagraph:2, startWithLorem:false}).startsWith('Lorem ipsum dolor'));

// words mode exact count
ok('words count', A.generate({seed:3, words:10}).split(/\s+/).length === 10);

// words are from bank
var w=A.generate({seed:3, words:5}).split(' ');
ok('words from bank', w.every(function(x){ return A.WORDS.indexOf(x)>=0; }));

console.log('LoremForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
