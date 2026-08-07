
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
// Official BIP39 test vector: 128-bit all-zero entropy -> known mnemonic + seed
var zero128='00000000000000000000000000000000';
var mn=A.mnemonicFromEntropy(zero128);
ok('zero entropy -> 12 words', mn.split(' ').length===12);
var seed=A.toSeed(mn,'');
ok('zero seed (official BIP39 vector, empty passphrase)', seed==='5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4');
// round-trip + checksum validation
var r=A.mnemonicToEntropy(mn);
ok('mnemonic->entropy valid', r.valid===true && r.entropyHex===zero128);
ok('bad length rejected', A.mnemonicToEntropy('zoo zoo').valid===false);
ok('wordlist size 2048', A.WORDS.length===2048);
ok('sha256 abc', A.sha256([97,98,99])==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
console.log('Bip39Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
