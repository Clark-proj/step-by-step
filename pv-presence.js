import * as THREE from './three.module.min.js';
import {profiles} from './pv-profiles.js';
import {createEssenceEffects} from './pv-effects.js';
import {createCompletionGate} from './pv-gate.js';
import {createLivingRig} from './pv-rig.js';
import {createSafeSurface} from './pv-surface.js';

/** Browser component: only mount inside the LARGE Essence detail. Pass an AbortSignal. */
export async function mountEssencePresence(host,{essenceId,expanded=false,completionLedger=null,signal,onReact=()=>{}}={}){
  const p=profiles[essenceId];if(!p)throw Error('Essenza sconosciuta: '+essenceId);
  const rig=createLivingRig(essenceId);
  if(signal?.aborted)return null;
  const src=new URL(p.src,import.meta.url).href,wrap=document.createElement('div');wrap.className='essence-presence';
  const base=document.createElement('img');base.src=src;base.alt=p.name+', '+p.quality;base.className='essence-static';base.draggable=false;
  const canvas=document.createElement('canvas'),fx=document.createElement('canvas');canvas.className='essence-render';fx.className='essence-effects';canvas.setAttribute('aria-hidden','true');fx.setAttribute('aria-hidden','true');
  const hit=document.createElement('button');hit.type='button';hit.className='essence-hit';hit.setAttribute('aria-label','Interagisci con '+p.name);wrap.append(base,canvas,fx,hit);host.append(wrap);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let destroyed=false,visible=false,paused=false,covered=false,ready=false,raf=0,last=0,time=0,frames=0,w=1,h=1,aspect=2/3,halfY=1.56;
  let renderer,texture,geometry,material,scene,camera,alphaData,surface,maskW=1,maskH=1;
  let nextBlink=3.5,blinkAt=-99,tapAt=-99,awakenAt=-99,completionAt=-99,ambientAt=1.2,lastTap=-Infinity,lastAwaken=-99,pressed=false,heldAt=0,charge=0,holdTriggered=false,suppressClick=false,startPoint=null,completionCount=0;
  const look={x:0,y:0,tx:0,ty:0};
  function size(){const ih=Math.min(h/1.04,w/aspect/1.04);return {ih,iw:ih*aspect};}
  function position(uv){const {iw,ih}=size(),q=surface?surface.transform(uv):uv;return {x:(w-iw)/2+q[0]*iw,y:(h-ih)/2+q[1]*ih};}
  function uvOf(e){const rect=wrap.getBoundingClientRect(),{iw,ih}=size(),screen=[(e.clientX-rect.left-(w-iw)/2)/iw,(e.clientY-rect.top-(h-ih)/2)/ih];let q=[...screen];for(let i=0;i<3;i++){const f=surface?surface.transform(q):q;q=[q[0]+screen[0]-f[0],q[1]+screen[1]-f[1]];}return q;}
  function opaqueAt(uv){const [x,y]=uv;return !!alphaData&&x>=0&&y>=0&&x<1&&y<1&&alphaData[(Math.floor(y*maskH)*maskW+Math.floor(x*maskW))*4+3]>=50;}
  const effects=createEssenceEffects(fx,{profile:p,position,opaqueAt});
  const u={time:{value:0},blink:{value:0},reaction:{value:0},charge:{value:0},awakening:{value:0},completion:{value:0},portrait:{value:null},imageHeight:{value:3}};
  const vec=v=>`vec2(${v.map(n=>Number(n).toFixed(5)).join(',')})`;
  const eyes=p.eyes.map(e=>`{vec2 d=(q-${vec(e.center)})/${vec(e.radius)};float z=exp(-pow(d.x,4.)-pow(d.y,4.));v.y+=(q.y-${e.center[1].toFixed(5)})*blink*.62*z*imageHeight;}`).join('\n');
  const vertex=`uniform float blink,imageHeight;varying vec2 vUv;
  void main(){vUv=uv;vec2 q=vec2(uv.x,1.-uv.y);vec3 v=position;
    ${eyes}
    gl_Position=projectionMatrix*modelViewMatrix*vec4(v,1.);
  }`;
  const glow=p.glow.map(n=>n.toFixed(5)).join(',');
  const fragment=`uniform sampler2D portrait;uniform float time,reaction,charge,awakening,completion;varying vec2 vUv;
  void main(){vec4 col=texture2D(portrait,vUv);vec2 q=vec2(vUv.x,1.-vUv.y);vec2 d=(q-${vec(p.symbol)})/${vec(p.symbolRadius)};
    float glow=exp(-dot(d,d)*2.);float intensity=.07+.08*(.5+.5*sin(time*1.7))+reaction*.25+charge*.23+awakening*.38+completion*.45;
    col.rgb+=vec3(${glow})*glow*intensity;gl_FragColor=col;
    #include <colorspace_fragment>
  }`;
  const active=()=>!destroyed&&ready&&expanded&&visible&&!covered&&!document.hidden&&!reduced.matches&&!paused;
  function paint(){if(!ready||destroyed||!w||!h)return;renderer.render(scene,camera);frames++;}
  function clear(){effects.clear();rig.reset();surface?.reset();pressed=false;charge=0;holdTriggered=false;startPoint=null;blinkAt=tapAt=awakenAt=completionAt=-99;look.x=look.y=look.tx=look.ty=0;ambientAt=time+1;nextBlink=time+3.5;if(ready){for(const key of ['blink','reaction','charge','awakening','completion'])u[key].value=0;paint();}}
  function sync(){if(destroyed)return;if(active()){base.hidden=true;canvas.hidden=false;fx.hidden=false;if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}}else{cancelAnimationFrame(raf);raf=0;clear();canvas.hidden=true;fx.hidden=true;base.hidden=false;}}
  function awaken(){if(!active()||time-lastAwaken<4.5)return false;lastAwaken=time;awakenAt=tapAt=time;nextBlink=time+.25;rig.react('hold',time);effects.awaken();onReact('awakening');return true;}
  function tick(now){raf=0;if(!active())return;raf=requestAnimationFrame(tick);const dt=(now-last)/1000;if(dt<1/30)return;last=now;const step=Math.min(dt,.08);time+=step;u.time.value=time;
    if(time>=nextBlink){blinkAt=time;nextBlink=time+4+Math.random()*3.5;}
    const b=(time-blinkAt)/.19;u.blink.value=b>=0&&b<1?Math.sin(b*Math.PI)**1.5:0;
    const r=Math.max(0,1-(time-tapAt)/1.2);u.reaction.value=r*r;
    rig.update(step,time);
    look.x+=(look.tx+rig.gazeX-look.x)*.15;look.y+=(look.ty+rig.gazeY-look.y)*.15;
    surface?.update(step,time,{head:rig.head,look:look.x,reaction:u.reaction.value,completion:u.completion.value});
    charge=pressed?Math.min(1,(time-heldAt)/1.1):Math.max(0,charge-step*2.8);u.charge.value=charge;
    if(pressed&&charge===1&&!holdTriggered){holdTriggered=true;awaken();}
    const a=(time-awakenAt)/3.6,c=(time-completionAt)/3.6;u.awakening.value=a>=0&&a<1?Math.sin(a*Math.PI):0;u.completion.value=c>=0&&c<1?Math.sin(c*Math.PI):0;
    if(time>=ambientAt){ambientAt=time+.8+Math.random()*.7;effects.ambient();}effects.draw(step,time,charge,u.completion.value);paint();
  }
  function onClick(e){if(suppressClick){suppressClick=false;return;}if(destroyed||!expanded||!visible||covered||document.hidden||!ready)return;const uv=e.detail===0?p.symbol:uvOf(e);if(e.detail!==0&&!opaqueAt(uv))return;if(performance.now()-lastTap<650)return;lastTap=performance.now();onReact('tap');if(!active())return;tapAt=time;rig.react('tap',time);nextBlink=time+.1;effects.tap(uv);}
  function onDown(e){if(e.button!==0||!active()||!opaqueAt(uvOf(e)))return;pressed=true;heldAt=time;holdTriggered=false;suppressClick=false;startPoint=[e.clientX,e.clientY];hit.setPointerCapture(e.pointerId);}
  function onMove(e){if(!active())return;const uv=uvOf(e);look.tx=Math.max(-1,Math.min(1,(uv[0]-p.head.center[0])*2));look.ty=Math.max(-1,Math.min(1,(uv[1]-p.head.center[1])*2));if(pressed&&startPoint&&Math.hypot(e.clientX-startPoint[0],e.clientY-startPoint[1])>12){pressed=false;charge=0;suppressClick=true;}}
  function onUp(){if(holdTriggered)suppressClick=true;pressed=false;startPoint=null;}
  function onCancel(){pressed=false;charge=0;suppressClick=true;startPoint=null;look.tx=look.ty=0;}
  function onLeave(){look.tx=look.ty=0;if(pressed)onCancel();}
  const context=e=>e.preventDefault();hit.addEventListener('click',onClick);hit.addEventListener('pointerdown',onDown);hit.addEventListener('pointermove',onMove);hit.addEventListener('pointerup',onUp);hit.addEventListener('pointercancel',onCancel);hit.addEventListener('pointerleave',onLeave);hit.addEventListener('contextmenu',context);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.35;sync();},{threshold:[0,.35]});observer.observe(wrap);
  function resize(){w=wrap.clientWidth;h=wrap.clientHeight;if(!w||!h)return;effects.resize(w,h);if(ready){halfY=Math.max((2/aspect)*1.04/2,1.04*h/w);camera.top=halfY;camera.bottom=-halfY;camera.left=-halfY*w/h;camera.right=halfY*w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);paint();}}
  const ro=new ResizeObserver(resize);ro.observe(wrap);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  const lost=e=>{e.preventDefault();ready=false;cancelAnimationFrame(raf);raf=0;effects.clear();canvas.hidden=true;fx.hidden=true;base.hidden=false;};canvas.addEventListener('webglcontextlost',lost);
  function destroy(){if(destroyed)return;destroyed=true;ready=false;cancelAnimationFrame(raf);raf=0;observer.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);signal?.removeEventListener('abort',destroy);canvas.removeEventListener('webglcontextlost',lost);hit.removeEventListener('click',onClick);hit.removeEventListener('pointerdown',onDown);hit.removeEventListener('pointermove',onMove);hit.removeEventListener('pointerup',onUp);hit.removeEventListener('pointercancel',onCancel);hit.removeEventListener('pointerleave',onLeave);hit.removeEventListener('contextmenu',context);effects.clear();geometry?.dispose();material?.dispose();texture?.dispose();renderer?.dispose();renderer?.forceContextLoss();wrap.remove();}
  signal?.addEventListener('abort',destroy,{once:true});
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
    const loaded=await new THREE.TextureLoader().loadAsync(src);if(destroyed){loaded.dispose();return null;}texture=loaded;texture.colorSpace=THREE.SRGBColorSpace;aspect=texture.image.width/texture.image.height;u.imageHeight.value=2/aspect;u.portrait.value=texture;
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-1,1,1.56,-1.56,.1,10);camera.position.z=3;
    geometry=new THREE.PlaneGeometry(2,2/aspect,80,120);material=new THREE.ShaderMaterial({uniforms:u,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthTest:false,depthWrite:false});scene.add(new THREE.Mesh(geometry,material));
    const mask=document.createElement('canvas');maskW=texture.image.width;maskH=texture.image.height;mask.width=maskW;mask.height=maskH;const mc=mask.getContext('2d',{willReadFrequently:true});mc.drawImage(texture.image,0,0);alphaData=mc.getImageData(0,0,maskW,maskH).data;
    surface=createSafeSurface(geometry,{rig,profile:p,alpha:alphaData,width:maskW,height:maskH,aspect});
    ready=true;resize();paint();sync();
  }catch(error){if(destroyed)return null;ready=false;cancelAnimationFrame(raf);raf=0;canvas.hidden=true;fx.hidden=true;base.hidden=false;console.warn(p.name+': immagine statica di riserva',error);}
  const celebrateTask=createCompletionGate({essenceId,ledger:completionLedger,isActive:active,play(){completionAt=time;rig.react('success',time);nextBlink=time+.2;effects.celebrate(time);},onAccepted(record,animated){completionCount++;if(!destroyed)onReact('task',record,animated);}});
  return {celebrateTask,awaken,setExpanded(value){expanded=!!value;sync();},setPaused(value){paused=!!value;sync();},setCovered(value){covered=!!value;sync();},getState(){return {essenceId,running:!!raf,ready,expanded,visible,paused,covered,reduced:reduced.matches,frames,particles:effects.count(),surface:surface?.getState(),completionCount};},destroy};
}
