import f from"fs"
let{MAKEFUN_INPUT_DIR:I="/input",MAKEFUN_OUTPUT_DIR:O="/output"}=process.env,R=f.readFileSync,W=f.writeFileSync,F=n=>{throw n},d,P,Q,S,M,K,U,s,q,p,t,b,h,l,m,k,v
for(d of f.readdirSync(I)){
v=I+"/"+d
P=R(v+"/program.bin")
Q=R(v+"/input.bin")
S=new Int32Array(256)
M=S.slice()
K=[]
U=""
s=q=p=0
t=1e6
try{
for(;;){
t--||F(10)
b=P[p]??F(9)
h=b>>4
l=b&15
l<[8,15,3,5,2,4][h]||F(5)
m=b<3?b*b:b>>2^12?0:2
P[p+m]??F(9)
k=[l-1>>1,2-(l==7|l==11),2,l>0&l<3,l+1,l!=2][h]
s<k&&F(2)
v=m&&P.readIntLE(p+1,m)
p+=1+m
h?h<3?(v=S[s-1],m=S[s-2],h=m>>>0,l=v>>>0,!v&b>18&b<23&&F(4),S[s-=k,s++]=[m+v,m-v,Math.imul(m,v),m/v,m%v,h/l,h%l,-v,m&v,m|v,m^v,~v,m<<v,m>>v,m>>>v,,m==v,m<v,h<l][b-16])
:h<4?l<3?!l||!S[--s]==l<2?p+=v:0:l<4?(K.push(p)>64&&F(7),p=v&65535):p=K.pop()??F(8)
:h<5?(m=S[s-1],M[m]??F(6),l?M[m]=S[s-=2]:S[s-1]=M[m])
:l==2?S[s++]=Q[q++]??-1:(m=S[--s],l>2?F(m&255):(v=U+(l?String.fromCharCode(m&255):m))[65536]?F(11):U=v)
:l?l<3?S[s++]=v:l<4?s--:(m=S[s-k],l&1?S.copyWithin(s-k,s-k+1,s)[s-1]=m:S[s++]=m):F(0)
s>256&&F(3)
}
}catch(e){
f.mkdirSync(d=O+"/"+d)
W(d+"/stdout.bin",U,"latin1")
W(d+"/exit.txt",e+"")
}
}