// Feather-local sparkles plus air effects. No rings, constellation or scanning band.
export function createIncantoEffects(canvas,position){
 const ctx=canvas.getContext('2d');let w=1,h=1,particles=[],scheduled=[];
 const featherAnchors=[[.18,.30],[.25,.34],[.32,.37],[.24,.43],[.38,.44],[.42,.51],[.88,.42],[.92,.49],[.87,.56],[.93,.60],[.16,.71],[.20,.79],[.32,.84],[.45,.89],[.62,.90],[.55,.85]];
 function star(x,y,r,alpha,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;ctx.fillStyle='#fff1c7';ctx.strokeStyle='#d5a34e';ctx.lineWidth=.55;ctx.shadowColor='#ffc764';ctx.shadowBlur=5;ctx.beginPath();ctx.moveTo(0,-r);ctx.quadraticCurveTo(r*.15,-r*.15,r,0);ctx.quadraticCurveTo(r*.15,r*.15,0,r);ctx.quadraticCurveTo(-r*.15,r*.15,-r,0);ctx.quadraticCurveTo(-r*.15,-r*.15,0,-r);ctx.fill();ctx.stroke();ctx.restore();}
 function spark(center,n,feathers=false){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=12+Math.random()*44;particles.push({x:center.x+(Math.random()-.5)*10,y:center.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-20,t:0,life:1.4+Math.random()*1.6,size:feathers?4+Math.random()*5:.7+Math.random()*1.5,feather:feathers,rot:Math.random()*3,hue:Math.random()});}if(particles.length>120)particles.splice(0,particles.length-120);}
 function plumage(n){for(let i=0;i<n;i++){const anchor=featherAnchors[(i*5+Math.floor(Math.random()*4))%featherAnchors.length];spark(position(anchor),1,true);}}
 function celebrationWave(){spark(position([.752,.391]),32);plumage(10);}
 return {
  resize(width,height){w=width;h=height;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);},
  clear(){particles=[];scheduled=[];ctx.clearRect(0,0,w,h);},
  tap(center,kind,time){spark(center,kind==='wing'?20:30);plumage(kind==='wing'?12:8);},
  awaken(time){spark(position([.752,.391]),42);plumage(14);},
  celebrate(time){celebrationWave();scheduled=[{at:time+.5,run:celebrationWave}];},
  ambient(time){if(particles.length<18){spark(position(featherAnchors[Math.floor(Math.random()*featherAnchors.length)]),2);if(Math.sin(time*.9)>.8)plumage(1);}},
  count(){return particles.length;},
  draw(dt,time,charge,symbolUV,completion=0){ctx.clearRect(0,0,w,h);
   for(let i=scheduled.length-1;i>=0;i--)if(time>=scheduled[i].at){scheduled[i].run();scheduled.splice(i,1);}
   // Independent short pulses at fixed feather locations; no moving light strip.
   featherAnchors.forEach((uv,i)=>{const period=3.2+(i%5)*.73;const t=(time+i*.61)%period;const pulse=t<.85?Math.pow(Math.sin(Math.PI*t/.85),2):0;if(pulse<.02)return;const p=position(uv);star(p.x,p.y,1.7+pulse*(1.2+completion),pulse*(.50+charge*.12+completion*.22),i*.2);});
   for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.t+=dt;if(p.t>p.life){particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.989;p.vy-=dt*3;const a=Math.sin(Math.PI*p.t/p.life)*.78;
    if(p.feather){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot+p.t*.48);ctx.globalAlpha=a;ctx.fillStyle=p.hue>.5?'#ffbd69':'#ef8e43';ctx.strokeStyle='#fff2cd';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,-p.size);ctx.quadraticCurveTo(p.size*.9,-p.size*.1,0,p.size);ctx.quadraticCurveTo(-p.size*.5,-p.size*.1,0,-p.size);ctx.fill();ctx.beginPath();ctx.moveTo(0,-p.size*.8);ctx.lineTo(0,p.size*1.15);ctx.stroke();ctx.restore();}else star(p.x,p.y,p.size,a,p.t*.3);
   }
  }
 };
}
