// Bound the stretch of every triangle touching the visible silhouette.
// All body, root, head and anchor movements are resolved BEFORE this constraint.
export function createSafeSurface(geometry,{rig,profile,alpha,width,height,aspect,maxStrain=.035}){
 const uv=geometry.attributes.uv,position=geometry.attributes.position,n=uv.count;
 const x=new Float32Array(n),y=new Float32Array(n),dx=new Float32Array(n),dy=new Float32Array(n);
 const headWeight=new Float32Array(n),anchorWeight=new Float32Array(n),breathWeight=new Float32Array(n);
 const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)};
 const cols=geometry.parameters.widthSegments,rows=geometry.parameters.heightSegments,occupied=new Uint8Array(cols*rows);
 // Include thin feathers and antennae even when all triangle vertices are transparent.
 for(let py=0;py<height;py++)for(let px=0;px<width;px++)if(alpha[(py*width+px)*4+3]>30){const cx=Math.min(cols-1,Math.floor(px*cols/(width-1))),cy=Math.min(rows-1,Math.floor(py*rows/(height-1)));occupied[cy*cols+cx]=1;}
 for(let i=0;i<n;i++){
  x[i]=uv.getX(i);y[i]=1-uv.getY(i);
  const hx=(x[i]-profile.head.center[0])/profile.head.radius[0],hy=(y[i]-profile.head.center[1])/profile.head.radius[1];
  headWeight[i]=Math.exp(-(hx*hx+hy*hy)*1.2);
  const bx=(x[i]-profile.body[0])/profile.bodyRadius[0],by=(y[i]-profile.body[1])/profile.bodyRadius[1];breathWeight[i]=Math.exp(-(bx*bx+by*by)*2);
  let a=smooth(profile.anchorY,Math.min(1,profile.anchorY+.08),y[i]);
  for(const r of profile.anchorRects||[])a=Math.max(a,smooth(r[0],r[0]+.06,x[i])*(1-smooth(r[2]-.06,r[2],x[i]))*smooth(r[1],r[1]+.06,y[i])*(1-smooth(r[3]-.06,r[3],y[i])));
  anchorWeight[i]=a;
 }
 const index=geometry.index.array,triangles=[];
 for(let i=0;i<index.length;i+=3){const a=index[i],b=index[i+1],c=index[i+2];
  const cellX=Math.min(cols-1,Math.floor((x[a]+x[b]+x[c])*cols/3)),cellY=Math.min(rows-1,Math.floor((y[a]+y[b]+y[c])*rows/3));if(!occupied[cellY*cols+cellX])continue;
  const ax=x[b]-x[a],ay=(y[b]-y[a])/aspect,bx=x[c]-x[a],by=(y[c]-y[a])/aspect,det=ax*by-bx*ay;
  triangles.push([a,b,c,by/det,-bx/det,-ay/det,ax/det]);
 }
 const derivatives=new Float32Array(triangles.length*4);
 const influences=rig.weights(geometry),matrices=rig.joints.map(j=>({px:j.pivot[0],py:j.pivot[1],c:1,s:0,slide:0}));
 let scale=0,lastAllowed=1,maxStretch=1,minStretch=1;
 function permissible(s){let max=1,min=1;for(let i=0;i<derivatives.length;i+=4){const a=1+s*derivatives[i],b=s*derivatives[i+1],c=s*derivatives[i+2],d=1+s*derivatives[i+3],det=a*d-b*c;if(det<=0)return false;
   const tr=a*a+b*b+c*c+d*d,disc=Math.sqrt(Math.max(0,tr*tr-4*det*det)),hi=Math.sqrt((tr+disc)*.5),lo=Math.sqrt(Math.max(0,(tr-disc)*.5));
   if(hi>1+maxStrain||lo<1-maxStrain)return false;max=Math.max(max,hi);min=Math.min(min,lo);
  }maxStretch=max;minStretch=min;return true;}
 function update(dt,time,{head=0,look=0,reaction=0,completion=0}={}){
  const angle=head+look*.006+reaction*.005+completion*.004+profile.head.angle*Math.sin(time*.61),co=Math.cos(angle),si=Math.sin(angle),pivot=profile.head.pivot;
  matrices.forEach((m,i)=>{m.c=Math.cos(rig.values[i][0]);m.s=Math.sin(rig.values[i][0]);m.slide=rig.values[i][2];});
  for(let i=0;i<n;i++){
   const q=[x[i],y[i]],hx=q[0]-pivot[0],hy=(q[1]-pivot[1])/aspect;let rx=0,ry=0,total=0;
   if(rig.continuous){const r=rig.transform(q,aspect);rx=r[0]-q[0];ry=r[1]-q[1]-rig.hover;}
   else for(let b=0;b<matrices.length;b++){const weight=influences[Math.floor(b/4)][i*4+b%4];if(weight<.001)continue;const m=matrices[b],bx=q[0]-m.px,by=(q[1]-m.py)/aspect;rx+=weight*((m.c-1)*bx-m.s*by);ry+=weight*((m.s*bx+(m.c-1)*by)*aspect+m.slide);total+=weight;}
   rx/=Math.max(1,total);ry/=Math.max(1,total);
   const headX=(co*hx-si*hy-hx)*headWeight[i],headY=((si*hx+co*hy)*aspect-(q[1]-pivot[1]))*headWeight[i];
   const free=1-anchorWeight[i];dx[i]=(rx+headX)*free;dy[i]=(ry+headY-breathWeight[i]*.0017*Math.sin(time*profile.breath))*free;
  }
  for(let i=0;i<triangles.length;i++){const [a,b,c,ia,ib,ic,id]=triangles[i],ux=dx[b]-dx[a],uy=(dy[b]-dy[a])/aspect,vx=dx[c]-dx[a],vy=(dy[c]-dy[a])/aspect,k=i*4;
   derivatives[k]=ux*ia+vx*ic;derivatives[k+1]=ux*ib+vx*id;derivatives[k+2]=uy*ia+vy*ic;derivatives[k+3]=uy*ib+vy*id;
  }
  let allowed=1;if(!permissible(1)){let lo=0,hi=1;for(let i=0;i<9;i++){const mid=(lo+hi)*.5;if(permissible(mid))lo=mid;else hi=mid;}allowed=lo;}
  lastAllowed=allowed;scale=Math.min(allowed,scale+(allowed-scale)*(1-Math.exp(-dt*7)));if(!permissible(scale)){scale=0;permissible(0);}
  for(let i=0;i<n;i++)position.setXYZ(i,(x[i]+dx[i]*scale-.5)*2,(.5-y[i]-dy[i]*scale-rig.hover)*2/aspect,0);
  position.needsUpdate=true;
 }
 // Particle anchors and hit testing use the same constrained, interpolated surface.
 function transform(q){const cols=geometry.parameters.widthSegments,rows=geometry.parameters.heightSegments,gx=Math.max(0,Math.min(cols,q[0]*cols)),gy=Math.max(0,Math.min(rows,q[1]*rows)),ix=Math.min(cols-1,Math.floor(gx)),iy=Math.min(rows-1,Math.floor(gy)),u=gx-ix,v=gy-iy;
  const a=iy*(cols+1)+ix,b=a+1,c=a+cols+1,d=c+1;
  const interp=arr=>(arr[a]*(1-u)+arr[b]*u)*(1-v)+(arr[c]*(1-u)+arr[d]*u)*v;
  return [q[0]+interp(dx)*scale,q[1]+interp(dy)*scale+rig.hover];
 }
 return {update,transform,reset(){scale=0;dx.fill(0);dy.fill(0);for(let i=0;i<n;i++)position.setXYZ(i,(x[i]-.5)*2,(.5-y[i])*2/aspect,0);position.needsUpdate=true;},getState(){return {scale,allowed:lastAllowed,maxStretch,minStretch,limit:maxStrain,triangles:triangles.length};}};
}
