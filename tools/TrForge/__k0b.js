
(function(){
  function expand(set){
    var out=[]; var i=0;
    while(i<set.length){
      if(set[i+1]==='-'&&i+2<set.length){ var a=set.charCodeAt(i), b=set.charCodeAt(i+2);
        for(var c=a;c<=b;c++) out.push(String.fromCharCode(c)); i+=3; }
      else { out.push(set[i]); i++; }
    }
    return out;
  }
  function run(text,set1,set2,del,sq){
    text=String(text==null?'':text);
    var s1=expand(set1);
    if(del){ var drop={}; s1.forEach(function(c){drop[c]=1;}); return {value: text.split('').filter(function(c){return !drop[c];}).join(''); }; }
    var s2=expand(set2); var map={};
    for(var i=0;i<s1.length;i++){ map[s1[i]]= s2.length? s2[Math.min(i,s2.length-1)] : s1[i]; }
    var res=text.split('').map(function(c){ return map.hasOwnProperty(c)? map[c] : c; }).join('');
    if(sq){ res=res.replace(/(.)\1+/g,function(m,c){ return c; }); }
    return {value:res};
  }
  var API={run:run,expand:expand};
  if(typeof module!=='undefined'&&module.exports)module.exports=API;
  if(typeof window!=='undefined')window.__TrForge__=API;
})();
