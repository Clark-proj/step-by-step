// Local highlights and finite-lived particles. No rings, constellations or scans.
export function createEssenceEffects(canvas,{profile,position,opaqueAt,density=1}){
  const D=Math.max(1,density),CAP=Math.min(700,Math.round(120*D)),B=Math.min(D,4);
  const ctx=canvas.getContext('2d');let width=1,height=1,particles=[],scheduled=[];
  const rng=(a,b)=>a+Math.random()*(b-a);
  function star(x,y,size,alpha,color){ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.shadowColor=profile.colors[0];ctx.shadowBlur=4;ctx.beginPath();ctx.moveTo(0,-size);ctx.quadraticCurveTo(size*.14,-size*.14,size,0);ctx.quadraticCurveTo(size*.14,size*.14,0,size);ctx.quadraticCurveTo(-size*.14,size*.14,-size,0);ctx.quadraticCurveTo(-size*.14,-size*.14,0,-size);ctx.fill();ctx.restore();}
  function emit(uv,n,ornaments=0){const origin=position(uv);for(let i=0;i<n+ornaments;i++){const angle=rng(0,Math.PI*2),speed=rng(9,35);particles.push({x:origin.x+rng(-3,3),y:origin.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-13,life:rng(1.3,2.8),age:0,size:i<n?rng(.7,1.8)*(D>1?1.35:1):rng(3,6)*(D>1?1.45:1),large:i>=n,rotation:rng(0,6.28),spin:rng(-.6,.6),color:profile.colors[Math.floor(rng(0,profile.colors.length))]});}if(particles.length>CAP)particles.splice(0,particles.length-CAP);}
  let GL=null;const glints=()=>{if(GL)return GL;const base=profile.glints.filter(opaqueAt);GL=[...base];if(D>1){let tries=0;while(GL.length<base.length*D&&tries<base.length*D*6){tries++;const a=base[Math.floor(rng(0,base.length))];const q=[a[0]+rng(-.06,.06),a[1]+rng(-.06,.06)];if(opaqueAt(q))GL.push(q)}}return GL};
  function plumage(n){const anchors=profile.glints.filter(opaqueAt);for(let i=0;i<n&&anchors.length;i++)emit(anchors[Math.floor(rng(0,anchors.length))],0,1);}
  function wave(){emit(profile.symbol,26*B);plumage(12*B);}
  function ornament(p,alpha){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation+p.age*p.spin);ctx.globalAlpha=alpha;ctx.fillStyle=p.color;ctx.strokeStyle=profile.colors[2];ctx.lineWidth=.6;const s=p.size;ctx.beginPath();
    switch(profile.particle){
      case 'droplet':ctx.moveTo(0,-s);ctx.bezierCurveTo(s*.8,-s*.1,s,s*.9,0,s);ctx.bezierCurveTo(-s,s*.9,-s*.8,-s*.1,0,-s);break;
      case 'shard':ctx.moveTo(0,-s);ctx.lineTo(s*.55,0);ctx.lineTo(0,s);ctx.lineTo(-s*.55,0);ctx.closePath();break;
      case 'snow':ctx.arc(0,0,s*.42,0,Math.PI*2);break;
      case 'electric':ctx.moveTo(s*.2,-s);ctx.lineTo(-s*.5,s*.1);ctx.lineTo(0,s*.1);ctx.lineTo(-s*.2,s);ctx.lineTo(s*.55,-s*.1);ctx.lineTo(0,-s*.1);ctx.closePath();break;
      default:ctx.moveTo(0,-s);ctx.quadraticCurveTo(s*.9,-s*.1,0,s);ctx.quadraticCurveTo(-s*.5,-s*.1,0,-s);
    }ctx.fill();if(['feather','leaf','petal'].includes(profile.particle)){ctx.beginPath();ctx.moveTo(0,-s*.7);ctx.lineTo(0,s*.9);ctx.stroke();}ctx.restore();}
  return {
    resize(w,h){width=w;height=h;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);},
    clear(){particles=[];scheduled=[];ctx.clearRect(0,0,width,height);},
    tap(uv){emit(uv,24*B,4*B);plumage(5*B);},
    awaken(){emit(profile.symbol,38*B,5*B);plumage(10*B);},
    celebrate(time){wave();scheduled=[{at:time+.45,run:wave}];},
    ambient(){if(particles.length<20*D){const anchors=glints();if(anchors.length){const p=anchors[Math.floor(rng(0,anchors.length))];emit(p,2,Math.random()<(D>1?.5:.28)?1:0);}}},
    count(){return particles.length;},
    draw(dt,time,charge,completion){ctx.clearRect(0,0,width,height);for(let i=scheduled.length-1;i>=0;i--)if(time>=scheduled[i].at){scheduled[i].run();scheduled.splice(i,1);}
      glints().forEach((uv,i)=>{if(i<profile.glints.length&&!opaqueAt(uv))return;const period=3.6+(i%5)*.72,t=(time+i*.83)%period,pulse=t<.8?Math.sin(Math.PI*t/.8)**2:0;if(pulse<.02)return;const pos=position(uv);star(pos.x,pos.y,1.5+pulse*(1+completion),pulse*(.43+charge*.17+completion*.25),profile.colors[2]);});
      for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.age+=dt;if(p.age>p.life){particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*.35);p.vy-=dt*1.8;const alpha=Math.sin(Math.PI*p.age/p.life)*.75;if(p.large)ornament(p,alpha);else star(p.x,p.y,p.size,alpha,p.color);}
    }
  };
}
