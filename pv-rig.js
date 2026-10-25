// Anatomical 2D skinning, not a global wobble. Each joint has a root and a mask.
const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const bone=(name,pivot,polygon,kind,side=1,scale=1)=>({name,pivot,polygon,kind,side,scale});
const ear=(name,pivot,box,side=1,scale=1)=>bone(name,pivot,rect(...box),'ear',side,scale);
const tail=(pivot,box,scale=1)=>bone('coda',pivot,rect(...box),'tail',1,scale);
const wing=(name,pivot,polygon,side,scale=1)=>bone(name,pivot,polygon,'wing',side,scale);
function jointsFor(id){switch(id){
case 'prism':return [
 wing('ala anteriore sinistra',[.42,.355],[[.0,.06],[.29,.07],[.39,.28],[.44,.35],[.40,.405],[.14,.42],[.02,.29]],-1),
 wing('ala anteriore destra',[.60,.355],[[1,.06],[.73,.07],[.63,.28],[.58,.35],[.62,.405],[.88,.42],[.99,.29]],1),
 wing('ala posteriore sinistra',[.43,.405],[[.39,.39],[.44,.43],[.43,.55],[.31,.65],[.01,.57],[.02,.43]],-1,.74),
 wing('ala posteriore destra',[.59,.405],[[.63,.39],[.58,.43],[.59,.55],[.71,.65],[.99,.57],[.98,.43]],1,.74),
 ear('antenna sinistra',[.467,.224],[.27,.04,.478,.223],-1,1.3),ear('antenna destra',[.544,.224],[.54,.04,.735,.223],1,1.3),
 bone('zampa sinistra',[.43,.407],rect(.374,.402,.476,.526),'paw',-1,.65),bone('zampa destra',[.588,.407],rect(.542,.402,.644,.526),'paw',1,.65),
 tail([.38,.56],[.045,.56,.465,.98],.65),tail([.64,.56],[.55,.56,.98,.98],.65)];
case 'sage':return [wing('piume foglia',[.48,.35],[[.03,.19],[.39,.20],[.53,.36],[.47,.58],[.18,.67],[.02,.47]],-1,.48),bone('coda',[.44,.64],[[.40,.64],[.60,.65],[.78,.68],[.88,.76],[.88,.89],[.77,.84],[.64,.80],[.50,.78],[.43,.72]],'tail',1,.6),ear('ciuffo',[.57,.18],[.29,.03,.78,.18],-1,.50)];
case 'brook':return [bone('zampa sollevata',[.74,.45],[[.71,.43],[.81,.28],[.96,.275],[.98,.37],[.87,.46],[.76,.49]],'paw',1,1.1),wing('pinna del collo',[.37,.30],rect(.12,.20,.38,.41),-1,.45),tail([.41,.69],[.05,.65,.97,.91],.65)];
case 'hearth':return [ear('orecchio sinistro',[.715,.295],[.55,.24,.72,.30],-1),ear('orecchio destro',[.83,.285],[.83,.23,.99,.30],1),tail([.32,.53],[.02,.43,.35,.65],.55)];
case 'moss':return [bone('fronde',[.48,.28],rect(.1,.025,.87,.29),'foliage',1,.5),bone('foglie laterali',[.48,.42],rect(.12,.32,.43,.62),'foliage',-1,.35)];
case 'nyx':return [ear('orecchio sinistro',[.76,.215],[.66,.08,.80,.22],-1,.75),ear('orecchio destro',[.87,.225],[.84,.11,.96,.23],1,.65),tail([.48,.58],[.07,.36,.57,.80],.65)];
case 'wisp':return [ear('orecchio sinistro',[.72,.26],[.37,.025,.73,.26],-1),ear('orecchio destro',[.81,.255],[.81,.025,.97,.26],1),tail([.49,.61],[.02,.42,.59,.95],.9),bone('zampa sollevata',[.79,.48],rect(.74,.48,.97,.59),'paw',1,.9)];
case 'fathom':return [wing('cresta',[.54,.26],rect(.14,.04,.58,.255),-1,.65),wing('pinna',[.66,.52],rect(.63,.36,.89,.64),1,.55),tail([.45,.70],[.12,.69,.81,.97],.8)];
case 'aster':return [ear('orecchio sinistro',[.61,.35],[.1,.04,.61,.35],-1,.7),ear('orecchio destro',[.69,.34],[.64,.01,.86,.34],1,.65),tail([.29,.72],[.08,.61,.32,.80],.4)];
case 'bloom':return [wing('ala alta',[.58,.37],rect(.2,.01,.59,.35),-1,.9),wing('ala laterale',[.59,.39],rect(.03,.25,.59,.45),-1,.8),wing('ala destra',[.65,.39],rect(.66,.32,.98,.50),1,.7),tail([.45,.57],[.17,.57,.84,.97],.8)];
case 'brume':return [wing('pinna dorsale',[.67,.35],rect(.12,.10,.67,.36),-1,.6),wing('pinna ventrale',[.80,.48],rect(.79,.43,.99,.68),1,.55),tail([.39,.55],[.015,.53,.68,.95],.8)];
case 'echo':return [wing('ala sinistra',[.62,.39],[[.0,.04],[.61,.06],[.65,.38],[.55,.57],[.04,.61]],-1,.9),wing('ala destra',[.81,.43],rect(.81,.33,.99,.65),1,.8),ear('orecchio',[.79,.28],[.77,.11,.93,.28],1,.7),tail([.55,.59],[.19,.59,.87,.95],.65)];
case 'lumen':return [ear('orecchio sinistro',[.69,.23],[.57,.15,.72,.25],-1,.65),ear('orecchio destro',[.90,.25],[.88,.18,.98,.27],1,.5),bone('criniera',[.75,.32],rect(.34,.06,.76,.50),'foliage',-1,.35),tail([.32,.59],[.02,.35,.37,.68],.9)];
case 'quartz':return [ear('orecchio',[.55,.135],[.45,.055,.61,.15],-1,.7),bone('pelo della spalla',[.53,.3],rect(.17,.25,.49,.56),'foliage',-1,.25)];
case 'rill':return [wing('pinna sinistra',[.59,.37],rect(.10,.20,.59,.48),-1,.6),wing('pinna destra',[.74,.38],rect(.74,.29,.98,.56),1,.6),tail([.48,.62],[.13,.61,.96,.97],.9),ear('cresta',[.69,.16],[.36,.02,.72,.17],-1,.5)];
case 'veil':return [wing('velo superiore',[.51,.28],rect(.08,.02,.54,.33),-1,.55),wing('velo laterale',[.72,.44],rect(.72,.34,.99,.64),1,.5),tail([.43,.67],[.12,.66,.98,.98],.85)];
case 'volt':return [wing('ala sinistra',[.57,.44],[[.005,.005],[.38,.03],[.60,.42],[.55,.49],[.13,.46]],-1,.95),wing('ala destra',[.72,.48],rect(.73,.37,.99,.68),1,.95),tail([.45,.58],[.02,.57,.78,.98],.8),bone('artiglio',[.60,.56],rect(.55,.56,.68,.65),'paw',1,.7)];
case 'ember':return [wing('ala sinistra',[.53,.40],[[.04,.15],[.43,.22],[.55,.38],[.51,.49],[.16,.58],[.04,.49]],-1,.65),wing('ala destra',[.82,.39],rect(.82,.29,.98,.65),1,.55),ear('cresta',[.65,.16],[.40,.04,.75,.17],-1,.4),tail([.44,.70],[.02,.69,.77,.96],.65)];
default:return [];}}
const random=(a,b)=>a+Math.random()*(b-a);
function smooth(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}
function polygonDistance(q,poly){let inside=false,min=Infinity;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
 const a=poly[j],b=poly[i];if((b[1]>q[1])!==(a[1]>q[1])&&q[0]<(a[0]-b[0])*(q[1]-b[1])/(a[1]-b[1])+b[0])inside=!inside;
 const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/(dx*dx+dy*dy||1)));min=Math.min(min,Math.hypot(q[0]-a[0]-t*dx,q[1]-a[1]-t*dy));
 }return inside?min:-min;}
export function createLivingRig(id){
 const continuous=['veil','fathom','rill','brume'].includes(id),joints=continuous?[]:jointsFor(id),airborne=['prism','bloom','echo','volt','fathom','brume','rill','veil','wisp'].includes(id);
 const state=joints.map((j,i)=>({z:0,vz:0,fold:0,vf:0,target:0,until:0,next:random(.6,2)+i*.13,phase:i*.9,impulse:0}));
 let warm=0,head=0,vhead=0,headTarget=0,gazeX=0,gazeY=0,nextLook=.8,lookUntil=0,nextFlutter=2,flutterAt=-99,reactionAt=-99,headReset=0,flowTime=0;
 const values=joints.map(()=>[0,0,0]);
 return {joints,values,continuous,head:0,gazeX:0,gazeY:0,hover:0,
  weights(geometry){const uv=geometry.attributes.uv,n=uv.count,arrays=[new Float32Array(n*4),new Float32Array(n*4),new Float32Array(n*4)];for(let i=0;i<n;i++){const q=[uv.getX(i),1-uv.getY(i)];for(let b=0;b<joints.length;b++){const j=joints[b],dist=polygonDistance(q,j.polygon),root=Math.hypot(q[0]-j.pivot[0],(q[1]-j.pivot[1])*1.5);const weight=smooth(-.035,.045,dist)*smooth(.02,.15,root);arrays[Math.floor(b/4)][i*4+b%4]=weight;}}return arrays;},
  transform(q,aspect=2/3){if(continuous){const envelope=Math.sin(Math.PI*Math.max(0,Math.min(1,q[1])))**2;return [q[0]+Math.sin(flowTime*1.2+q[1]*5)*.006*envelope*warm,q[1]+this.hover];}let dx=0,dy=0,total=0;for(let i=0;i<joints.length;i++){const j=joints[i],root=Math.hypot(q[0]-j.pivot[0],(q[1]-j.pivot[1])*1.5),weight=smooth(-.035,.045,polygonDistance(q,j.polygon))*smooth(.02,.15,root);if(weight<.001)continue;const v=values[i],x=q[0]-j.pivot[0],y=(q[1]-j.pivot[1])/aspect,c=Math.cos(v[0]),s=Math.sin(v[0]);dx+=weight*(x*c-y*s+j.pivot[0]-q[0]);dy+=weight*((x*s+y*c)*aspect+j.pivot[1]+v[2]-q[1]);total+=weight;}return [q[0]+dx/Math.max(1,total),q[1]+dy/Math.max(1,total)+this.hover];},
  reset(){warm=0;head=vhead=headTarget=gazeX=gazeY=0;headReset=0;flutterAt=reactionAt=-99;state.forEach((s,i)=>{s.z=s.vz=s.fold=s.vf=s.target=s.impulse=0;s.until=0;s.next=-1;values[i].fill(0)});this.head=this.gazeX=this.gazeY=this.hover=0;},
  react(kind,time){reactionAt=time;headTarget=kind==='success'?-.055:-.04;headReset=time+.28;flutterAt=time+.12;state.forEach((s,i)=>{const j=joints[i];s.target=(j.kind==='ear'?.21:j.kind==='paw'?.16:.075)*j.side*j.scale;s.until=time+(j.kind==='ear'?.13:.28);});},
  update(dt,time){flowTime=time;if(warm===0){nextLook=time+random(.8,1.5);nextFlutter=time+random(2,4);}warm=Math.min(1,warm+dt*1.8);
    if(time>nextLook){gazeX=random(-.65,.65);gazeY=random(-.24,.24);headTarget=gazeX*.07;lookUntil=time+random(.7,1.7);nextLook=lookUntil+random(1,2);}
    if(time>lookUntil&&time>headReset)headTarget*=Math.exp(-dt*4);
    if(time>headReset&&time-reactionAt<1&&time-reactionAt>.28)headTarget=0;
    if(time>nextFlutter){flutterAt=time;nextFlutter=time+random(4.3,7);}
    const ftime=time-flutterAt,burst=ftime>=0&&ftime<1.15?Math.sin(Math.PI*ftime/1.15)**2:0;
    const steps=Math.max(1,Math.ceil(dt/.008)),h=dt/steps;
    for(let i=0;i<state.length;i++){const s=state[i],j=joints[i];if(s.next<0)s.next=time+random(.4,2.5);if(time>s.next){if(j.kind==='ear'||j.kind==='paw'){s.target=random(.12,.22)*j.side*j.scale;s.until=time+random(.09,.17);}s.next=time+random(j.kind==='ear'?1.4:3,j.kind==='ear'?3.7:6.5);}
      const twitch=time<s.until?s.target:0;let tz=0,tf=0;
      if(j.kind==='wing'){tf=0;tz=j.side*j.scale*(Math.sin(time*1.45+s.phase)*.023+burst*.026)+twitch*.45;}
      if(j.kind==='ear')tz=twitch+Math.sin(time*.82+s.phase)*.009;
      if(j.kind==='paw')tz=twitch+Math.sin(time*.9+s.phase)*.012;
      if(j.kind==='tail')tz=j.scale*(Math.sin(time*1.18+s.phase)*.046+Math.sin(time*2.1+s.phase)*.012)+twitch*.35;
      if(j.kind==='foliage')tz=j.scale*(Math.sin(time*1.6+s.phase)*.035)+twitch*.35;
      for(let k=0;k<steps;k++){const stiffness=j.kind==='ear'?260:j.kind==='paw'?180:85,damping=j.kind==='ear'?19:17;s.vz+=(stiffness*(tz-s.z)-damping*s.vz)*h;s.z+=s.vz*h;s.vf+=(95*(tf-s.fold)-18*s.vf)*h;s.fold+=s.vf*h;}
      values[i][0]=s.z*warm;values[i][1]=s.fold*warm;values[i][2]=j.kind==='tail'?Math.sin(time*1.4+s.phase)*.006*j.scale*warm:0;
    }
    for(let k=0;k<steps;k++){vhead+=(145*(headTarget-head)-20*vhead)*h;head+=vhead*h;}
    this.head=head*warm;this.gazeX=gazeX*warm;this.gazeY=gazeY*warm;this.hover=airborne?Math.sin(time*1.8)*.007*warm:0;
  }
 };
}
