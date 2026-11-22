import{readFileSync,readdirSync,mkdirSync,writeFileSync}from"node:fs";
import{join}from"node:path";
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output",E=new TextEncoder();
// Opcode table, one char per opcode byte 0..83: charCode-40 packs imm*8+pops*2+up,
// where up=1 when the opcode pushes one more value than it pops (PUSH8, PUSH32,
// DUP, OVER, IN). Only those can overflow the 256-value stack, and only at 256.
const T="(1I*+,-.((((((((,,,,,,,*,,,*,,,(,,,(((((((((((((8::8((((((((((((*,((((((((((((((**)*";
for(const d of readdirSync(I).sort()){
 const P=readFileSync(join(I,d,"program.bin")),Q=readFileSync(join(I,d,"input.bin"));
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),U=new Uint8Array(65536);
 let s=0,c=0,o=0,q=0,p=0,t=0,e=-1;
 while(e<0){
  if(t==1e6){e=10;break}
  if(p<0||p>=P.length){e=9;break}
  const b=P[p];
  if(!(b<8||b>15&&b<35&&b!=31||b>47&&b<53||b>63&&b<66||b>79&&b<84)){e=5;break}
  const v=T.charCodeAt(b)-40,m=v>>3,n=p+1+m;
  if(p+m>=P.length){e=9;break}
  t++;
  if(s<((v>>1)&3)){e=2;break}
  if(v&1&&s==256){e=3;break}
  p=n;
  if(b==0){e=0;break}
  else if(b==1)D[s++]=(P[n-1]<<24)>>24;
  else if(b==2)D[s++]=P[n-4]|P[n-3]<<8|P[n-2]<<16|P[n-1]<<24;
  else if(b==3)s--;
  else if(b==4){D[s]=D[s-1];s++}
  else if(b==5){const x=D[s-1];D[s-1]=D[s-2];D[s-2]=x}
  else if(b==6){D[s]=D[s-2];s++}
  else if(b==7){const x=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=x}
  else if(b==23)D[s-1]=-D[s-1]|0;
  else if(b==27)D[s-1]=~D[s-1];
  else if(b>15&&b<35){
   const y=D[s-1],x=D[s-2];let r=0;
   if(b==16)r=x+y|0;
   else if(b==17)r=x-y|0;
   else if(b==18)r=Math.imul(x,y);
   else if(b==19){if(!y){e=4;break}r=x==-2147483648&&y==-1?x:(x/y)|0}
   else if(b==20){if(!y){e=4;break}r=y==-1?0:x%y|0}
   else if(b==21){if(!y){e=4;break}r=Math.floor((x>>>0)/(y>>>0))|0}
   else if(b==22){if(!y){e=4;break}r=(x>>>0)%(y>>>0)|0}
   else if(b==24)r=x&y;
   else if(b==25)r=x|y;
   else if(b==26)r=x^y;
   else if(b==28)r=x<<(y&31);
   else if(b==29)r=x>>(y&31);
   else if(b==30)r=(x>>>(y&31))|0;
   else if(b==32)r=x==y?1:0;
   else if(b==33)r=x<y?1:0;
   else r=(x>>>0)<(y>>>0)?1:0;
   s-=2;D[s++]=r;
  }
  else if(b==48)p=n+(((P[n-2]|P[n-1]<<8)<<16)>>16);
  else if(b==49||b==50){const v=D[--s];if((b==49)==(v==0))p=n+(((P[n-2]|P[n-1]<<8)<<16)>>16)}
  else if(b==51){if(c==64){e=7;break}C[c++]=n;p=P[n-2]|P[n-1]<<8}
  else if(b==52){if(!c){e=8;break}p=C[--c]}
  else if(b==64){const a=D[s-1];if(a<0||a>255){e=6;break}D[s-1]=M[a]}
  else if(b==65){const a=D[s-1];if(a<0||a>255){e=6;break}const v=D[s-2];s-=2;M[a]=v}
  else if(b==80){const g=E.encode(String(D[s-1]));if(o+g.length>65536){e=11;break}s--;U.set(g,o);o+=g.length}
  else if(b==81){if(o>65535){e=11;break}U[o++]=D[--s]&255}
  else if(b==82)D[s++]=q<Q.length?Q[q++]:-1;
  else e=D[--s]&255;
 }
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,"stdout.bin"),U.subarray(0,o));
 writeFileSync(join(O,d,"exit.txt"),e+"\n");
}
