// Guida illustrata animata: componente estratto da demo/app.js (Guide_per_Claude).
// Shader, coordinate, geometria, camera, sRGB, ampiezze e tempi sono copiati dalla demo senza modifiche.
// Uso: const f = createGuideFigure(contenitore, {guide:'ember', moving:true, assetBase:'figures/'});
//      f.setGuide('sage'); f.pause(); f.resume(); f.celebrate(); f.destroy();
import * as THREE from './three.module.min.js';

// Coordinate normalizzate dei punti di ogni personaggio (demo/app.js, profiles). Solo dati grafici.
const PROFILES={
 ember:{head:[.635,.325],eye:[.698,.215],eye2:[-1,-1],amulet:[.752,.412],headBounds:[.39,.53,.28,.37],left:[.28,.43],right:[.92,.48],tail:[.42,.84],body:[.64,.46]},
 sage:{head:[.59,.36],eye:[.578,.243],eye2:[.693,.270],amulet:[.605,.403],headBounds:[.30,.41,.29,.38],left:[.28,.45],right:[.81,.51],tail:[.55,.79],body:[.56,.46]},
 brook:{head:[.48,.34],eye:[.466,.200],eye2:[.587,.170],amulet:[.586,.405],headBounds:[.20,.32,.24,.35],left:[.34,.42],right:[.87,.49],tail:[.56,.81],body:[.57,.51]}
};
const ASSET={ember:'ember.webp',sage:'sage.webp',brook:'moss.webp',aster:'sage.webp',moss:'moss.webp'};
const AURA={ember:[1,.61,.15],sage:[1,.61,.15],brook:[.12,.64,1]};
const ALT={moss:'Moss, figura illustrata dell’area Corpo',aster:'Aster, figura illustrata',ember:'Ember, figura illustrata dell’area Lavoro',sage:'Sage, figura illustrata dell’area Mente',brook:'Brook, figura illustrata dell’area Corpo'};
const vertex=`
 uniform float time;uniform float blink;uniform float emphasis;uniform vec2 eyeCenter;uniform vec2 eyeSecond;uniform vec2 headPivot;uniform vec4 headBounds;uniform vec2 leftCenter;uniform vec2 rightCenter;uniform vec2 tailCenter;uniform vec2 bodyCenter;varying vec2 vUv;
 float area(vec2 p,vec2 c,vec2 r){vec2 d=(p-c)/r;return exp(-dot(d,d)*2.0);}
 void main(){
  vUv=uv;vec2 p=vec2(uv.x,1.0-uv.y);vec2 original=p;
  // Local feather motion. Rock, feet and background have zero weight.
  float left=area(p,leftCenter,vec2(.34,.25));
  float right=area(p,rightCenter,vec2(.17,.22));
  p.x+=left*.0032*sin(time*.44+p.y*7.0);
  p.y+=left*.0017*sin(time*.44+p.x*5.0);
  p.x+=right*.0023*sin(time*.37+.8);
  float tail=area(p,tailCenter,vec2(.51,.17));
  p.x+=tail*.0024*sin(time*.39+p.y*8.0);
  p.y+=tail*.0010*sin(time*.43+p.x*6.0);
  float body=area(p,bodyCenter,vec2(.23,.17));
  p.y-=body*.0011*sin(time*.62);
  // Compress only the eye region for a very brief blink.
  vec2 eye=eyeCenter;vec2 d=(original-eye)/vec2(.038,.021);
  float eyeMask=exp(-pow(d.x,4.0)-pow(d.y,4.0));
  p.y-=(original.y-eye.y)*blink*.92*eyeMask;
 vec2 d2=(original-eyeSecond)/vec2(.038,.021);float m2=exp(-pow(d2.x,4.0)-pow(d2.y,4.0));p.y-=(original.y-eyeSecond.y)*blink*.92*m2;
  // Tiny head inclination anchored at the base of the neck.
  vec2 pivot=headPivot;float angle=.0065*sin(time*.35)+emphasis*.003;
  mat2 rot=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
  float head=(1.0-smoothstep(headBounds.z,headBounds.w,original.y))*smoothstep(headBounds.x,headBounds.y,original.x);
  p+=((rot*(p-pivot)+pivot)-p)*head;
  gl_Position=projectionMatrix*modelViewMatrix*vec4((p.x-.5)*2.0,(.5-p.y)*3.0,0.0,1.0);
 }`;
const fragment=`
 uniform sampler2D portrait;uniform float time;uniform float emphasis;uniform vec2 amulet;uniform vec3 auraColor;varying vec2 vUv;
 void main(){vec4 color=texture2D(portrait,vUv);
  vec2 p=vec2(vUv.x,1.0-vUv.y);vec2 d=(p-amulet)/vec2(.052,.039);
  float glow=exp(-dot(d,d)*1.9);float pulse=.10+.07*(.5+.5*sin(time*.85))+emphasis*.36;
  color.rgb+=auraColor*glow*pulse;
  gl_FragColor=color;
  #include <colorspace_fragment>
 }`;
const UNIFORM_KEYS={eyeCenter:'eye',eyeSecond:'eye2',headPivot:'head',headBounds:'headBounds',leftCenter:'left',rightCenter:'right',tailCenter:'tail',bodyCenter:'body',amulet:'amulet'};
let cssDone=false;
function injectCSS(){if(cssDone)return;cssDone=true;const st=document.createElement('style');st.textContent=
`.gf{position:relative;width:100%;height:100%;isolation:isolate}
.gf-aura{position:absolute;left:50%;top:50.5%;width:87%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:rgba(255,255,255,.55)}
.gf-shadow{position:absolute;left:50%;bottom:1.2%;width:58%;height:6.5%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(70,50,35,.24),rgba(70,50,35,.10) 55%,transparent);z-index:0;pointer-events:none}
.gf canvas,.gf img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.gf img{z-index:0}.gf canvas{z-index:1;opacity:0;transition:opacity .3s}.gf canvas.ready{opacity:1}
.gf.gf-loading canvas,.gf.gf-loading img{opacity:0!important;transition:none}
.gf-speck{position:absolute;z-index:3;width:3px;height:3px;background:#ffda84;border-radius:50%;opacity:.3;pointer-events:none;animation:gf-float 13s ease-in-out infinite}
.gf-speck.s1{left:20%;top:64%}.gf-speck.s2{left:79%;top:35%;animation-delay:-5s}.gf-speck.s3{left:70%;top:78%;animation-delay:-8s}
@keyframes gf-float{0%,100%{transform:translateY(0);opacity:0}40%,60%{opacity:.45}90%{transform:translateY(-25px);opacity:0}}
.gf.gf-paused .gf-speck{animation-play-state:paused;opacity:0}
@media(prefers-reduced-motion:reduce){.gf-speck{animation:none;opacity:0}.gf canvas{transition:none}}`;document.head.appendChild(st)}

export function createGuideFigure(container,opts={}){
  injectCSS();
  const base=opts.assetBase||'';const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let id=ASSET[opts.guide]?opts.guide:'ember';const STATIC=!PROFILES[id];
  let moving=opts.moving!=null?!!opts.moving:!reduced.matches;
  let dirty=true,ready=false,destroyed=false,loading=false,pendingCelebrate=false,visible=true;
  let renderer=null,material=null,geometry=null,scene=null,camera=null,raf=0,ro=null,io=null;
  let elapsed=0,last=performance.now(),nextBlink=5.8,blinkStart=-100,celebrationStart=-100;
  const textureCache=new Map();let loadRevision=0;
  container.classList.add('gf','gf-loading');
  container.innerHTML='<div class="gf-aura"></div><div class="gf-shadow"></div><img alt=""><canvas role="img"></canvas><span class="gf-speck s1"></span><span class="gf-speck s2"></span><span class="gf-speck s3"></span>';
  const img=container.querySelector('img'),canvas=container.querySelector('canvas'),aura=container.querySelector('.gf-aura');
  // Cerchio sempre tondo: diametro sul lato minore del contenitore (nella demo 390x405 coincide con l'ellisse originale).
  const fitAura=()=>{const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;const d=Math.min(w*.88,h*.87);aura.style.width=d+'px'}
  const labels=()=>{img.alt=ALT[id];canvas.setAttribute('aria-label','Illustrazione animata: '+ALT[id])};
  const syncPaused=()=>{container.classList.toggle('gf-paused',!moving);dirty=true};
  const onReduced=()=>{moving=!reduced.matches;syncPaused()};
  const onVisibility=()=>{last=performance.now();dirty=true};
  reduced.addEventListener('change',onReduced);document.addEventListener('visibilitychange',onVisibility);syncPaused();
  img.src=base+ASSET[id];labels();
  try{
    if(STATIC)throw new Error('static');
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-1,1,1.56,-1.56,.1,10);camera.position.z=3;
    const p=PROFILES[id];
    material=new THREE.ShaderMaterial({uniforms:{portrait:{value:null},time:{value:0},blink:{value:0},emphasis:{value:0},eyeCenter:{value:new THREE.Vector2(...p.eye)},eyeSecond:{value:new THREE.Vector2(...p.eye2)},headPivot:{value:new THREE.Vector2(...p.head)},headBounds:{value:new THREE.Vector4(...p.headBounds)},leftCenter:{value:new THREE.Vector2(...p.left)},rightCenter:{value:new THREE.Vector2(...p.right)},tailCenter:{value:new THREE.Vector2(...p.tail)},bodyCenter:{value:new THREE.Vector2(...p.body)},amulet:{value:new THREE.Vector2(...p.amulet)},auraColor:{value:new THREE.Vector3(...AURA[id])}},vertexShader:vertex,fragmentShader:fragment,transparent:true,depthTest:false,depthWrite:false});
    geometry=new THREE.PlaneGeometry(2,3,160,230);scene.add(new THREE.Mesh(geometry,material));
    // Come la demo; se il contenitore e' piu' stretto di 2:3 si adatta la larghezza per non tagliare la figura.
    const resize=()=>{if(destroyed)return;const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(w,h,false);const a=w/h;if(1.56*a>=1.04){camera.left=-1.56*a;camera.right=1.56*a;camera.top=1.56;camera.bottom=-1.56}else{camera.left=-1.04;camera.right=1.04;camera.top=1.04/a;camera.bottom=-1.04/a}camera.updateProjectionMatrix();dirty=true};
    ro=new ResizeObserver(()=>{fitAura();resize()});ro.observe(container);fitAura();resize();
    if('IntersectionObserver' in window){io=new IntersectionObserver(es=>{for(const e of es){visible=e.isIntersecting;if(visible){last=performance.now();dirty=true}}});io.observe(container)}
  }catch(error){if(!STATIC)console.warn('Illustrazione statica attiva: animazione non disponibile.',error);
    try{renderer&&renderer.dispose()}catch(e){}renderer=null;material=null;canvas.hidden=true;moving=false;syncPaused();ro=new ResizeObserver(fitAura);ro.observe(container);fitAura()}
  function animate(now){raf=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.07);last=now;if(!ready||document.hidden||!visible||(!moving&&!dirty))return;if(moving){elapsed+=dt;if(elapsed>=nextBlink){blinkStart=elapsed;nextBlink=elapsed+5.8+Math.random()*4.5;}const phase=(elapsed-blinkStart)/.19;const blink=phase>=0&&phase<=1?Math.pow(Math.sin(phase*Math.PI),1.7):0;material.uniforms.time.value=elapsed;material.uniforms.blink.value=blink;const progress=elapsed-celebrationStart;material.uniforms.emphasis.value=progress>=0&&progress<5?Math.sin(progress/5*Math.PI)**2:0;}else{material.uniforms.blink.value=0;material.uniforms.emphasis.value=0;}renderer.render(scene,camera);dirty=false;}
  async function load(target){const revision=++loadRevision;loading=true;container.classList.add('gf-loading');container.setAttribute('aria-busy','true');
    try{
      if(!renderer){await new Promise((res,rej)=>{const t=new Image();t.onload=res;t.onerror=rej;t.src=base+ASSET[target]});if(destroyed||revision!==loadRevision)return;id=target;img.src=base+ASSET[target];labels();return}
      let texture=textureCache.get(target);
      if(!texture){texture=await new THREE.TextureLoader().loadAsync(base+ASSET[target]);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);if(destroyed){texture.dispose();return}textureCache.set(target,texture)}
      if(destroyed||revision!==loadRevision)return;
      id=target;const u=material.uniforms,p=PROFILES[target];u.portrait.value=texture;
      for(const [uniform,key] of Object.entries(UNIFORM_KEYS))u[uniform].value.set(...p[key]);u.auraColor.value.set(...AURA[target]);
      img.src=base+ASSET[target];labels();
      if(ready){nextBlink=elapsed+3.5;celebrationStart=-100}
      if(pendingCelebrate){pendingCelebrate=false;celebrationStart=elapsed}
      dirty=true;renderer.render(scene,camera);dirty=false;
      if(!ready){ready=true;canvas.classList.add('ready');img.hidden=true;if(!raf)raf=requestAnimationFrame(animate)}
    }catch(e){if(revision===loadRevision)console.warn('Figura non caricata',e)}
    finally{if(!destroyed&&revision===loadRevision){loading=false;container.classList.remove('gf-loading');container.setAttribute('aria-busy','false')}}}
  load(id);
  return{
    get guide(){return id},
    _state(){return{emphasis:material?material.uniforms.emphasis.value:0,celebrating:elapsed-celebrationStart>=0&&elapsed-celebrationStart<5,moving,ready,loading,webgl:!!renderer,raf:!!raf}},get moving(){return moving},get ready(){return ready},
    setGuide(next){if(destroyed||!ASSET[next])return;if(next===id&&!loading){return}load(next)},
    pause(){if(destroyed)return;moving=false;syncPaused()},
    resume(){if(destroyed||!renderer)return;moving=true;last=performance.now();syncPaused()},
    celebrate(){if(destroyed)return;if(loading){pendingCelebrate=true;return}celebrationStart=elapsed;dirty=true},
    destroy(){if(destroyed)return;destroyed=true;loadRevision++;if(raf)cancelAnimationFrame(raf);raf=0;
      ro&&ro.disconnect();io&&io.disconnect();reduced.removeEventListener('change',onReduced);document.removeEventListener('visibilitychange',onVisibility);
      for(const t of textureCache.values())t.dispose();textureCache.clear();geometry&&geometry.dispose();material&&material.dispose();
      if(renderer){renderer.dispose();try{renderer.forceContextLoss()}catch(e){}}renderer=material=geometry=scene=camera=null;
      container.innerHTML='';container.classList.remove('gf','gf-loading','gf-paused')}
  }}
