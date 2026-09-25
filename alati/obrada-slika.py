import numpy as np, cv2
from PIL import Image
OUT='../src/assets/kamen/'
rng=np.random.default_rng(7)

def load(n): return np.asarray(Image.open(f'{n}_x4.png').convert('RGB')).astype(np.float32)/255, np.asarray(Image.open(f'{n}_x4_mask.png').convert('L')).astype(np.float32)/255

def tone(rgb, amount=0.82):
    # jedinstveno toniranje: luminancija -> topla skala kamena, uz dio izvorne boje
    L=0.2126*rgb[...,0]+0.7152*rgb[...,1]+0.0722*rgb[...,2]
    L=np.clip((L-0.08)/0.86,0,1)
    L=L**1.08
    stops=np.array([[0.00,0.090,0.075,0.062],[0.35,0.36,0.32,0.28],[0.62,0.62,0.57,0.50],[0.85,0.86,0.82,0.76],[1.0,0.95,0.925,0.88]])
    out=np.stack([np.interp(L,stops[:,0],stops[:,c]) for c in (1,2,3)],-1)
    gray=np.repeat(L[...,None],3,-1)
    nat=rgb*0.5+gray*0.5
    return out*amount+nat*(1-amount)

def grain(rgb, strength=0.035):
    h,w=rgb.shape[:2]
    n=rng.normal(0,1,(h,w)).astype(np.float32)
    n=cv2.GaussianBlur(n,(0,0),0.7)*0.7+rng.normal(0,1,(h,w)).astype(np.float32)*0.3
    L=rgb.mean(-1,keepdims=True)
    return np.clip(rgb+n[...,None]*strength*(0.4+L),0,1)

def normal_map(rgb, blur=7.0, strength=2.2):
    L=cv2.bilateralFilter(rgb.mean(-1).astype(np.float32),9,0.08,6)
    L=cv2.GaussianBlur(L,(0,0),blur)
    gx=cv2.Sobel(L,cv2.CV_32F,1,0,ksize=3); gy=cv2.Sobel(L,cv2.CV_32F,0,1,ksize=3)
    nx=-gx*strength; ny=gy*strength; nz=np.ones_like(L)
    ln=np.sqrt(nx*nx+ny*ny+nz*nz); n=np.stack([nx/ln,ny/ln,nz/ln],-1)
    return (n*0.5+0.5)

def ellipse(h,w,cx,cy,rx,ry,feather=0.35):
    y,x=np.mgrid[0:h,0:w].astype(np.float32)
    d=np.sqrt(((x-cx*w)/(rx*w))**2+((y-cy*h)/(ry*h))**2)
    return np.clip((1-d)/feather,0,1)**1.5

def save_rgba(rgb,a,name,maxh):
    im=Image.fromarray((np.dstack([rgb,a])*255).astype(np.uint8),'RGBA')
    if im.height>maxh: im=im.resize((round(im.width*maxh/im.height),maxh),Image.LANCZOS)
    im.save(OUT+name+'.png',optimize=True); return im.size

def save_rgb(rgb,name,size):
    Image.fromarray((rgb*255).astype(np.uint8)).resize(size,Image.LANCZOS).save(OUT+name+'.png',optimize=True)

heads={ # ime: (slika, okvir u 1x koordinatama, elipsa cx,cy,rx,ry, koristi rembg)
 'glava-1':('3',(10,0,340,330),(0.55,0.5,0.52,0.56),False),
 'glava-2':('3',(330,170,580,456),(0.55,0.52,0.5,0.55),False),
 'glava-3':('4',(165,55,335,290),(0.58,0.5,0.5,0.55),False),
 'glava-4':('4',(280,140,430,310),(0.58,0.52,0.48,0.55),False),
 'glava-5':('4',(455,150,597,335),(0.5,0.52,0.5,0.52),True),
}
for name,(n,b,e,use_m) in heads.items():
    rgb,m=load(n); x0,y0,x1,y1=[v*4 for v in b]
    c=rgb[y0:y1,x0:x1]; mm=m[y0:y1,x0:x1]
    h,w=c.shape[:2]
    cx,cy,rx,ry=e
    a=ellipse(h,w,cx,cy,rx*1.12,ry*1.12,feather=0.75)
    if use_m:
        # nebo (plavo) ukloni prema boji
        hsv=cv2.cvtColor((c*255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(np.float32)
        sky=((hsv[...,0]>85)&(hsv[...,0]<135)&(hsv[...,1]>40)).astype(np.float32)
        sky=cv2.GaussianBlur(cv2.dilate(sky,np.ones((25,25))),(0,0),12)
        a=a*(1-sky)
    # svjetlo odozgo lijevo: rubovi i donja desna strana tonu u sjenu
    y,x=np.mgrid[0:h,0:w].astype(np.float32)
    lit=np.clip(1.15-0.55*((x/w-0.3)**2+(y/h-0.3)**2)**0.5*1.6,0.25,1)
    # rubovi pravokutnika uvijek potpuno prozirni
    ey=np.clip(np.minimum(y,h-1-y)/(h*0.12),0,1); ex=np.clip(np.minimum(x,w-1-x)/(w*0.12),0,1)
    a=a*(ex*ey)**1.2
    a=np.clip(np.nan_to_num(a),0,1)
    shade=(0.25+0.75*a**0.8)*lit
    t=grain(tone(c),0.022)*shade[...,None]
    size=save_rgba(t,a,name,1200)
    save_rgb(normal_map(c),name+'-n',size)
    print(name,size)

# Sv. Mihovil: rembg maska, okvir do dna postolja, meki prijelaz na dnu
rgb,m=load('1'); x0,y0,x1,y1=[v*4 for v in (95,60,305,410)]
c=rgb[y0:y1,x0:x1]; a=np.clip((m[y0:y1,x0:x1]-0.08)*1.35,0,1)
h,w=a.shape; fade=np.clip((h-np.arange(h))/(h*0.12),0,1)[:,None]; a=a*fade
print('mihovil',save_rgba(grain(tone(c,0.75),0.03),a,'mihovil',1400))
# (karta reljefa za Mihovila nije potrebna)

# Katedrala: rembg maska, samo zgrada
rgb,m=load('2'); x0,y0,x1,y1=[v*4 for v in (95,15,430,318)]
c=rgb[y0:y1,x0:x1]; a=np.clip((m[y0:y1,x0:x1]-0.1)*1.3,0,1)
h,w=a.shape; fade=np.clip((h-np.arange(h))/(h*0.1),0,1)[:,None]; a=a*fade
a=a*np.clip(np.arange(w)/(w*0.07),0,1)[None,:]**1.4
print('katedrala',save_rgba(grain(tone(c,0.7),0.025),a,'katedrala',1300))
