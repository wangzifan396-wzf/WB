const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

// base64
ok(P.b64('hello')==='aGVsbG8=', 'base64 of hello');
ok(P.b64('')==='', 'base64 of empty');
ok(P.b64('a')==='YQ==', 'base64 pads single byte');

// name sanitize
ok(P.sanitizeName('My App!')==='my-app', 'sanitize lowercases and dashes');
ok(P.sanitizeName('  Café_X ')==='caf-x', 'sanitize strips invalid chars');
ok(P.sanitizeName('a'.repeat(80)).length===63, 'name capped at 63');
ok(P.isValidName('web-app')===true, 'valid RFC1123 name');
ok(P.isValidName('Web_App')===false, 'uppercase/underscore invalid');

// deployment
var dep=P.genDeployment({name:'api',image:'nginx:1.25',port:8080,replicas:3});
ok(/kind: Deployment/.test(dep), 'deployment kind');
ok(/name: api/.test(dep), 'deployment name');
ok(/replicas: 3/.test(dep), 'deployment replicas');
ok(/containerPort: 8080/.test(dep), 'deployment port');
ok(/image: nginx:1.25/.test(dep), 'deployment image');
ok(/app: api/.test(dep), 'deployment selector');
var def=P.genDeployment({});
ok(/replicas: 1/.test(def), 'deployment defaults replicas=1');
ok(/containerPort: 80/.test(def), 'deployment defaults port=80');

// service
var svc=P.genService({name:'api',port:80,targetPort:8080,type:'LoadBalancer'});
ok(/kind: Service/.test(svc), 'service kind');
ok(/type: LoadBalancer/.test(svc), 'service type');
ok(/port: 80/.test(svc), 'service port');
ok(/targetPort: 8080/.test(svc), 'service targetPort');

// configmap
var cm=P.genConfigMap({name:'cfg',data:{KEY:'val','N':42}});
ok(/kind: ConfigMap/.test(cm), 'configmap kind');
ok(/KEY: "val"/.test(cm), 'configmap entry');

// secret
var sec=P.genSecret({name:'sec',data:{TOKEN:'s3cr3t'}});
ok(/kind: Secret/.test(sec), 'secret kind');
ok(/type: Opaque/.test(sec), 'secret opaque');
ok(/TOKEN: czNjcjN0/.test(sec), 'secret base64-encodes value');
ok(P.b64('s3cr3t')==='czNjcjN0', 'b64 matches secret encoding');

// ingress
var ing=P.genIngress({name:'ing',host:'app.example.com',service:'api',port:80});
ok(/kind: Ingress/.test(ing), 'ingress kind');
ok(/host: app.example.com/.test(ing), 'ingress host');
ok(/name: api/.test(ing), 'ingress backend service');

// hpa
var hpa=P.genHPA({name:'api',minReplicas:2,maxReplicas:10,cpuUtilization:75});
ok(/kind: HorizontalPodAutoscaler/.test(hpa), 'hpa kind');
ok(/maxReplicas: 10/.test(hpa), 'hpa max');
ok(/averageUtilization: 75/.test(hpa), 'hpa cpu target');

// pvc
var pvc=P.genPVC({name:'data',size:'5Gi'});
ok(/kind: PersistentVolumeClaim/.test(pvc), 'pvc kind');
ok(/storage: 5Gi/.test(pvc), 'pvc storage');

// buildKind dispatch
ok(P.buildKind({kind:'deployment',name:'x'}).kind==='deployment', 'buildKind dispatches');
ok(P.buildKind({kind:'nope'}).error!==null, 'buildKind unknown kind errors');

// lint
ok(P.lintSpec({kind:'deployment',name:'Bad Name',image:'nginx'}).issues.some(function(i){return /RFC 1123/.test(i.msg);}), 'lint flags bad name');
ok(P.lintSpec({kind:'deployment',image:'nginx:1.25'}).issues.length===0, 'lint clean for valid deployment');
ok(P.lintSpec({kind:'hpa',minReplicas:10,maxReplicas:2}).issues.some(function(i){return /minReplicas/.test(i.msg);}), 'lint flags hpa min>max');
ok(P.lintSpec({kind:'deployment',image:'nginx:1.25'}).score===100, 'clean spec scores 100');

// runtime multi-doc
var rt=P.runtimeYaml([{kind:'deployment',name:'a',image:'nginx'},{kind:'service',name:'a'}]);
ok(/---\n/.test(rt.value), 'runtimeYaml joins with ---');
ok(rt.errors.length===0, 'runtimeYaml no errors for valid specs');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
