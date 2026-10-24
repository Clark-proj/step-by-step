/* Ember · Incanto 03 (Piume e luce). Integrato in Step by Step: solo percorsi di import e nome del file di configurazione adattati. */
import * as THREE from './three.module.min.js';
import {createIncantoEffects} from './incanto-effects.js';
import {createCompletionGate} from './completion-gate.js';

/** Component for one LARGE detail portrait. List thumbnails stay ordinary images. */
export async function mountEmberPresence(host, {src='./assets/ember-pulito.png', expanded=false, completionLedger=null, onReact=()=>{}}={}) {
  const config=await fetch(new URL('./ember-config.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Missing config');return r.json();});
  const base=document.createElement('img');base.src=src;base.alt='Ember, Essenza del lavoro';base.className='ember-static';
  const canvas=document.createElement('canvas'),fx=document.createElement('canvas');canvas.className='ember-render';fx.className='ember-effects';canvas.setAttribute('aria-hidden','true');fx.setAttribute('aria-hidden','true');
  const hit=document.createElement('button');hit.type='button';hit.className='ember-hit';hit.setAttribute('aria-label','Interagisci con Ember');
  host.append(base,canvas,fx,hit);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let destroyed=false,visible=false,userPaused=false,ready=false,raf=0,last=0,time=0,frames=0,nextBlink=3.5,blinkAt=-99,tapAt=-99,lastTap=-Infinity,w=1,h=1,pressed=false,heldAt=0,charge=0,holdTriggered=false,suppressClick=false,awakeningAt=-99,lastAwakening=-99,completionAt=-99,completionCount=0;
  const look={x:0,y:0,tx:0,ty:0};
  let renderer,texture,geometry,material,scene,camera,alphaData,maskW,maskH;
  const effects=createIncantoEffects(fx,position);
  const u={completion:{value:0},look:{value:new THREE.Vector2()},charge:{value:0},awakening:{value:0},time:{value:0},blink:{value:0},reaction:{value:0},portrait:{value:null},eye:{value:new THREE.Vector2(...config.eye)},head:{value:new THREE.Vector2(...config.headPivot)},symbol:{value:new THREE.Vector2(...config.symbol)}};
  const vertex=`uniform float time,blink,reaction,charge,awakening,completion;uniform vec2 eye,head,look;varying vec2 vUv;
  float zone(vec2 p,vec2 c,vec2 r){vec2 d=(p-c)/r;return exp(-dot(d,d)*2.);}
  void main(){vUv=uv;vec2 p=vec2(uv.x,1.-uv.y),q=p;
    float upperMask=1.-smoothstep(.70,.78,q.y);
    float l=zone(q,vec2(${config.leftWing}),vec2(.25,.24))*upperMask;
    float r=zone(q,vec2(${config.rightWing}),vec2(.16,.22))*upperMask;
    p.x+=l*.0040*sin(time*1.15+q.y*6.)+r*.0030*sin(time*1.30+.7);
    p.y+=l*.0018*sin(time*1.15+q.x*4.)+r*.0015*sin(time*1.30+.7);
    float tail=zone(q,vec2(${config.tail}),vec2(.38,.14));
    p.x+=tail*.0032*sin(time*.92+q.y*7.);p.y+=tail*.0014*sin(time*.92+q.x*5.);
    float chest=zone(q,vec2(${config.body}),vec2(.18,.17))*upperMask;
    p.y-=chest*.0017*sin(time*1.65);
    float hm=(1.-smoothstep(.31,.43,q.y))*smoothstep(.34,.48,q.x);
    p.x-=l*(reaction*.010+awakening*.019+completion*.013);p.y-=l*(reaction*.008+awakening*.016+completion*.013);p.x+=r*(reaction*.008+awakening*.011+completion*.011);p.y-=r*(reaction*.007+awakening*.012+completion*.010);
    float angle=.010*sin(time*.68)+reaction*.020+look.x*.018+awakening*.015;
    mat2 rot=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));p+=((rot*(p-head)+head)-p)*hm;
    vec2 d=(q-eye)/vec2(.033,.021);float eyeMask=exp(-pow(d.x,4.)-pow(d.y,4.));
    p.x+=look.x*.0017*eyeMask;p.y+=look.y*.0010*eyeMask;
    p.y-=(q.y-eye.y)*blink*.90*eyeMask;
    // Subpixel response of lower beak only. This is not lip sync or an articulated mouth.
    float beak=zone(q,vec2(${config.lowerBeak}),vec2(.026,.012));p.y+=beak*reaction*.0018;
    float perch=smoothstep(.55,.62,q.y)*smoothstep(.42,.49,q.x)*(1.-smoothstep(.90,.98,q.y));p=mix(p,q,perch);
    gl_Position=projectionMatrix*modelViewMatrix*vec4((p.x-.5)*2.,(.5-p.y)*3.,0.,1.);
  }`;
  const fragment=`uniform sampler2D portrait;uniform float time,reaction,charge,awakening,completion;uniform vec2 symbol;varying vec2 vUv;
    void main(){vec4 color=texture2D(portrait,vUv);vec2 p=vec2(vUv.x,1.-vUv.y);vec2 d=(p-symbol)/vec2(.048,.042);
      float glow=exp(-dot(d,d)*2.);float pulse=.055+.10*(.5+.5*sin(time*1.85))+reaction*.28+charge*.18+awakening*.35+completion*.45;
      color.rgb+=vec3(1.,.64,.16)*glow*pulse;gl_FragColor=color;
      #include <colorspace_fragment>
    }`;
  function active(){return !destroyed&&ready&&expanded&&visible&&!document.hidden&&!reduced.matches&&!userPaused;}
  function paint(){if(!ready||destroyed)return;renderer.render(scene,camera);frames++;}
  function resetEffects(){effects.clear();pressed=false;charge=0;awakeningAt=tapAt=blinkAt=completionAt=-99;look.tx=look.ty=look.x=look.y=0;if(ready){u.blink.value=0;u.reaction.value=0;u.charge.value=0;u.awakening.value=0;u.completion.value=0;u.look.value.set(0,0);paint();}}
  function sync(){if(destroyed)return;if(active()){if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}}else{cancelAnimationFrame(raf);raf=0;resetEffects();}}
  function position(uv){const ih=h*3/3.12,iw=ih*2/3;return {x:(w-iw)/2+uv[0]*iw,y:(h-ih)/2+uv[1]*ih};}
  let ambientAt=2;
  function tick(now){raf=0;if(!active())return;raf=requestAnimationFrame(tick);const dt=(now-last)/1000;if(dt<1/30)return;last=now;time+=Math.min(dt,.08);
    if(time>=nextBlink){blinkAt=time;nextBlink=time+3.8+Math.random()*3.5;}
    const phase=(time-blinkAt)/.18;u.blink.value=phase>=0&&phase<1?Math.pow(Math.sin(phase*Math.PI),1.5):0;
    const reaction=Math.max(0,1-(time-tapAt)/1.25);u.reaction.value=reaction*reaction;u.time.value=time;
    look.x+=(look.tx-look.x)*.075;look.y+=(look.ty-look.y)*.075;u.look.value.set(look.x,look.y);
    charge=pressed?Math.min(1,(time-heldAt)/1.1):Math.max(0,charge-.08);u.charge.value=charge;
    if(pressed&&charge>=1&&!holdTriggered){holdTriggered=true;awaken();}
    const ap=(time-awakeningAt)/3.7;u.awakening.value=ap>=0&&ap<=1?Math.sin(ap*Math.PI):0;
    const cp=(time-completionAt)/3.6;u.completion.value=cp>=0&&cp<=1?Math.sin(cp*Math.PI):0;
    if(time>=ambientAt){ambientAt=time+.65+Math.random()*.65;effects.ambient(time);}
    effects.draw(Math.min(dt,.08),time,charge,config.symbol,u.completion.value);paint();
  }
  function uvOf(event){const rect=host.getBoundingClientRect(),ih=h*3/3.12,iw=ih*2/3;return {x:(event.clientX-rect.left-(w-iw)/2)/iw,y:(event.clientY-rect.top-(h-ih)/2)/ih};}
  function onSilhouette(event){if(event.detail===0&&event.type==='click')return true;const p=uvOf(event);return p.x>=0&&p.x<1&&p.y>=0&&p.y<1&&(!alphaData||alphaData[(Math.floor(p.y*maskH)*maskW+Math.floor(p.x*maskW))*4+3]>=40);}
  function awaken(){if(!active()||time-lastAwakening<5)return false;lastAwakening=time;awakeningAt=time;tapAt=time;effects.awaken(time);nextBlink=time+.25;onReact('awakening');return true;}
  function react(event){if(suppressClick){suppressClick=false;return;}if(!expanded||!visible||document.hidden||destroyed||!ready||!onSilhouette(event))return;
    if(performance.now()-lastTap<650)return;lastTap=performance.now();const uv=event.detail===0?{x:config.symbol[0],y:config.symbol[1]}:uvOf(event);const kind=uv.y<.65&&uv.x<.48?'wing':'symbol';onReact(kind);if(reduced.matches||userPaused)return;tapAt=time;nextBlink=time+.10;effects.tap(position(kind==='wing'?config.leftWing:config.symbol),kind,time);
  }
  function pointerMove(event){if(!active())return;const p=uvOf(event);look.tx=Math.max(-1,Math.min(1,(p.x-.60)*2));look.ty=Math.max(-1,Math.min(1,(p.y-.30)*2));}
  function pointerLeave(){look.tx=look.ty=0;if(pressed)pointerEnd();}
  function pointerDown(event){if(event.button!==0||!active()||!onSilhouette(event))return;pressed=true;heldAt=time;holdTriggered=false;hit.setPointerCapture(event.pointerId);}
  function pointerEnd(){if(holdTriggered)suppressClick=true;pressed=false;}
  function pointerCancel(){pressed=false;charge=0;holdTriggered=false;suppressClick=true;look.tx=look.ty=0;}
  const preventMenu=e=>e.preventDefault();hit.addEventListener('contextmenu',preventMenu);hit.addEventListener('click',react);hit.addEventListener('pointermove',pointerMove);hit.addEventListener('pointerleave',pointerLeave);hit.addEventListener('pointerdown',pointerDown);hit.addEventListener('pointerup',pointerEnd);hit.addEventListener('pointercancel',pointerCancel);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.35;sync();},{threshold:[0,.35]});observer.observe(host);
  function resize(){w=host.clientWidth;h=host.clientHeight;if(!w||!h)return;effects.resize(w,h);if(ready){renderer.setSize(w,h,false);camera.left=-1.56*w/h;camera.right=1.56*w/h;camera.updateProjectionMatrix();paint();}}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  const lost=e=>{e.preventDefault();ready=false;cancelAnimationFrame(raf);raf=0;canvas.hidden=true;base.hidden=false;effects.clear();};canvas.addEventListener('webglcontextlost',lost);
  try {
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.debug.onShaderError=()=>{throw new Error('Ember shader compilation failed');};renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
    texture=await new THREE.TextureLoader().loadAsync(src);if(destroyed){texture.dispose();renderer.dispose();return null;}texture.colorSpace=THREE.SRGBColorSpace;u.portrait.value=texture;
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-1,1,1.56,-1.56,.1,10);camera.position.z=3;
    geometry=new THREE.PlaneGeometry(2,3,180,260);material=new THREE.ShaderMaterial({uniforms:u,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthTest:false,depthWrite:false});scene.add(new THREE.Mesh(geometry,material));
    try {const mask=document.createElement('canvas');maskW=texture.image.width;maskH=texture.image.height;mask.width=maskW;mask.height=maskH;const mc=mask.getContext('2d',{willReadFrequently:true});mc.drawImage(texture.image,0,0);alphaData=mc.getImageData(0,0,maskW,maskH).data;}catch{}
    ready=true;resize();paint();base.hidden=true;sync();
  }catch(error){ready=false;cancelAnimationFrame(raf);raf=0;canvas.hidden=true;fx.hidden=true;base.hidden=false;console.warn('Ember statico: WebGL non disponibile',error);}
  const celebrateTask=createCompletionGate({ledger:completionLedger,isActive:active,play(){completionAt=time;nextBlink=time+.2;effects.celebrate(time);},onAccepted(record,animated){completionCount++;if(!destroyed)onReact('task',record,animated);}});
  return {
    celebrateTask,
    setExpanded(value){expanded=Boolean(value);sync();},
    setPaused(value){userPaused=Boolean(value);sync();},
    awaken,
    getState(){return {running:Boolean(raf),expanded,visible,reduced:reduced.matches,ready,frames,particles:effects.count(),charge,completionCount,awakenings:lastAwakening>-99?1:0};},
    destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);canvas.removeEventListener('webglcontextlost',lost);hit.removeEventListener('contextmenu',preventMenu);hit.removeEventListener('click',react);hit.removeEventListener('pointermove',pointerMove);hit.removeEventListener('pointerleave',pointerLeave);hit.removeEventListener('pointerdown',pointerDown);hit.removeEventListener('pointerup',pointerEnd);hit.removeEventListener('pointercancel',pointerCancel);effects.clear();geometry?.dispose();material?.dispose();texture?.dispose();renderer?.dispose();renderer?.forceContextLoss();host.replaceChildren();}
  };
}
