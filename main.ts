import{readFileSync as A,readdirSync as B,mkdirSync as C,writeFileSync as D}from"node:fs";const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output",N=n=>new Int32Array(n);
let e=-1;const F=n=>{e=n;throw 0};
for(const d of B(I)){
 const P=A(I+"/"+d+"/program.bin"),Q=A(I+"/"+d+"/input.bin"),S=N(256),K=[],M=N(256),U=Buffer.alloc(65536);
 let s=0,c=0,o=0,q=0,p=0,t=1e6;e=-1;
 try{while(1){
  if(!t--)F(10);
  if(p<0|p>=P.length)F(9);
  const b=P[p],v="(1I*+,-.!!!!!!!!,,,,,,,*,,,*,,,!,,,!!!!!!!!!!!!!8::8(!!!!!!!!!!!*,!!!!!!!!!!!!!!**)*".charCodeAt(b)-40;
  if(!(v>=0))F(5);
  const m=v>>3,n=p+1+m;
  if(p+m>=P.length)F(9);
  if(s<(v>>1&3))F(2);
  if(v&1&s==256)F(3);
  p=n;
  if(b==0)F(0);
  else if(b<3)S[s++]=b<2?P.readInt8(n-1):P.readInt32LE(n-4);
  else if(b==3)s--;
  else if(b==4)S[s++]=S[s-2];
  else if(b==5)[S[s-1],S[s-2]]=[S[s-2],S[s-1]];
  else if(b==6)S[s++]=S[s-3];
  else if(b==7)[S[s-3],S[s-2],S[s-1]]=[S[s-2],S[s-1],S[s-3]];
  else if(b==23||b==27)S[s-1]=b<24?-S[s-1]:~S[s-1];
  else if(b>15&&b<35){
   const y=S[s-1],x=S[s-2],X=x>>>0,Y=y>>>0,w=y&31;
   if(!y&b>18&b<23)F(4);
   S[s-2]=[x+y,x-y,Math.imul(x,y),x/y,x%y,X/Y,X%Y,0,x&y,x|y,x^y,0,x<<w,x>>w,x>>>w,0,+(x==y),+(x<y),+(X<Y)][b-16];
   s--;
  }
  else if(b<51){if(b<49||(b==49)==(S[--s]==0))p=n+P.readInt16LE(n-2)}
  else if(b==51){if(c>63)F(7);K[c++]=n;p=P[n-2]|P[n-1]<<8}
  else if(b==52){if(!c)F(8);p=K[--c]}
  else if(b<66){const a=S[s-1];if(a<0|a>255)F(6);if(b<65)S[s-1]=M[a];else s-=2,M[a]=S[s];}
  else if(b==80){const g=Buffer.from(S[s-1]+"");if(o+g.length>65536)F(11);s--;U.set(g,o);o+=g.length}
  else if(b==81){if(o>65535)F(11);U[o++]=S[--s]&255}
  else if(b==82)S[s++]=Q[q++]??-1;
  else F(S[--s]&255);
 }}catch{}
 C(O+"/"+d,{recursive:true});D(O+"/"+d+"/stdout.bin",U.subarray(0,o));D(O+"/"+d+"/exit.txt",e+"");
}
