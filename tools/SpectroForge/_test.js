
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function near(a,b,t,msg){ ok(Math.abs(a-b)<=t, msg+' (got '+a+', want ~'+b+')'); }

// FFT：单位脉冲 -> 全 1
(function(){
  var re=[1,0,0,0,0,0,0,0], im=[0,0,0,0,0,0,0,0];
  P.fft(re, im); var mg=P.mag(re,im);
  ok(mg.every(function(v){ return Math.abs(v-1)<1e-9; }), '单位脉冲 FFT 各 bin 幅度=1');
})();

// FFT：余弦 bin1 幅度 ≈ N/2 = 4
(function(){
  var N=8, re=[], im=[];
  for(var i=0;i<N;i++){ re.push(Math.cos(2*Math.PI*1*i/N)); im.push(0); }
  P.fft(re, im); var mg=P.mag(re,im);
  near(mg[1], 4, 1e-6, '余弦 bin1 幅度=4');
  near(mg[7], 4, 1e-6, '余弦 bin7 幅度=4');
  near(mg[0], 0, 1e-6, '余弦 bin0 幅度=0');
})();

// 波形
var wf = P.computeWaveform([0,1,0,-1,0,1,0,-1], 4);
ok(wf.length===4, '波形返回 4 桶');
ok(wf.every(function(v){ return v>=0 && v<=1; }), '波形幅度在 [0,1]');

// 频谱图：合成 1000Hz @ 8kHz，峰值应在 bin≈128
(function(){
  var sr=8000, fftSize=1024, dur=0.3, N=Math.floor(sr*dur);
  var buf=new Float32Array(N);
  for(var i=0;i<N;i++) buf[i]=Math.sin(2*Math.PI*1000*i/sr);
  var sp=P.computeSpectrogram(buf, sr, {fftSize:fftSize});
  ok(!sp.error, '频谱图无错误');
  ok(sp.cols>0 && sp.bins===fftSize/2, '帧数>0 且 bins=fftSize/2');
  var col=sp.data[0], mx=0, mi=0;
  for(var b=0;b<col.length;b++) if(col[b]>mx){ mx=col[b]; mi=b; }
  near(P.freqAt(mi, sr, fftSize), 1000, sr/fftSize+1, '峰值频率≈1000Hz (bin='+mi+')');
  ok(P.binAt(1000, sr, fftSize)===Math.round(1000*fftSize/sr), 'binAt 反向一致');
})();

// 太短报错
ok(P.computeSpectrogram(new Float32Array(10), 44100, {fftSize:1024}).error!=null, '过短音频报错');

console.log((fail?'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
if(fail) process.exit(1);
