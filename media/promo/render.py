"""OpenDipper launch film, deterministic 1920x1080 / 30 fps / 50 s.
Motion reference: Amicro TextReveal easing and smooth spring presets.
See notices/Amicro-LICENSE.txt. No application source is modified.
"""
from pathlib import Path
from functools import lru_cache
import argparse, io, json, math, os, subprocess, time, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cairosvg

ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[1]
OUT=ROOT/'output'; OUT.mkdir(exist_ok=True)
W,H,FPS,DURATION=1920,1080,30,50
BLUE=(105,185,233); GREEN=(154,215,68); WHITE=(231,240,248)
MUTED=(142,169,189); GOLD=(236,191,100); BG=(7,13,22)
ZH=Path(os.environ.get('OD_FONT_ZH', str(Path.home()/'.local/share/fonts/NotoSansCJKsc-Regular.otf')))
EN=Path(os.environ.get('OD_FONT_EN','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
BOLD=Path(os.environ.get('OD_FONT_BOLD','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
RNG=np.random.default_rng(20261026)

def clamp(v,a=0,b=1):return min(b,max(a,v))
def lerp(a,b,t):return a+(b-a)*t
def smooth(t):t=clamp(t);return t*t*(3-2*t)
def bezier(t):
    # Amicro TextReveal's [0.16, 1, 0.3, 1], sampled by x for deterministic frames.
    if t<=0:return 0.
    if t>=1:return 1.
    t=clamp(t); lo,hi=0.,1.
    for _ in range(12):
        u=(lo+hi)/2; x=3*(1-u)**2*u*.16+3*(1-u)*u*u*.3+u**3
        if x<t:lo=u
        else:hi=u
    u=(lo+hi)/2
    return 3*(1-u)**2*u+3*(1-u)*u*u+u**3
def spring(t):
    # Analytic underdamped response of Amicro's smooth preset (220,24,1).
    if t<=0:return 0
    z=12.; wd=math.sqrt(220-z*z)
    return 1-math.exp(-z*t)*(math.cos(wd*t)+z/wd*math.sin(wd*t))
def rgba(c,a=255):return tuple(c[:3])+(int(clamp(a,0,255)),)

@lru_cache(maxsize=256)
def font(size,kind='zh'):
    return ImageFont.truetype(str(ZH if kind=='zh' else BOLD if kind=='bold' else EN),size)
@lru_cache(maxsize=512)
def text_tile(text,size,color=WHITE,kind='zh',weight=0):
    f=font(size,kind); box=f.getbbox(text,stroke_width=weight)
    out=Image.new('RGBA',(box[2]-box[0]+8,box[3]-box[1]+8))
    ImageDraw.Draw(out).text((4-box[0],4-box[1]),text,font=f,fill=rgba(color),stroke_width=weight,stroke_fill=rgba(color))
    return out
def put(im,tile,x,y,opacity=1):
    if opacity<=0:return
    if opacity<.999:
        tile=tile.copy(); tile.putalpha(tile.getchannel('A').point(lambda a:int(a*opacity)))
    im.alpha_composite(tile,(int(x),int(y)))
def text(im,s,x,y,size=40,color=WHITE,kind='zh',align='left',opacity=1,reveal=None,weight=0):
    tile=text_tile(s,size,tuple(color),kind,weight)
    if reveal is not None:
        q=bezier(reveal); dy=round((1-q)*(tile.height+10))
        if dy>=tile.height:return
        canvas=Image.new('RGBA',tile.size); canvas.alpha_composite(tile,(0,dy));tile=canvas
    if align=='center':x-=tile.width/2
    elif align=='right':x-=tile.width
    put(im,tile,x,y,opacity)

BRAND={'logo.svg':'public/brand/opendipper/opendipper-horizontal-dark.svg','xlab.svg':'public/brand/XlabAI_Horizontal_ColorDark.svg'}
@lru_cache(maxsize=32)
def svg(name,width):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=str(REPO/BRAND[name]),output_width=width))).convert('RGBA')
SCREEN={name:Image.open(REPO/'docs/assets'/f'opendipper-1.6.0-{name}-20261027.jpg').convert('RGBA') for name in ['atlas-dark','atlas-light','galaxy-dark','galaxy-light','tour-dark']}
FACTS=json.loads((ROOT/'facts.json').read_text())
SOURCE=json.loads((REPO/FACTS['basis']).read_text())
for stat in FACTS['radarFoundation']:
    if stat['value'] != SOURCE['upstream']['summary'][stat['key']]:
        raise ValueError('Promotional figure differs from pinned global source: '+stat['key'])
if FACTS['sourceUpdatedAt'] != SOURCE['upstream']['summary']['updatedAt']:
    raise ValueError('Promotional source date is stale')
@lru_cache(maxsize=24)
def screenshot(name,w,h,crop=None):
    im=SCREEN[name]
    if crop:im=im.crop(crop)
    ratio=min(w/im.width,h/im.height);size=(int(im.width*ratio+.5),int(im.height*ratio+.5))
    im=im.resize(size,Image.Resampling.LANCZOS)
    tile=Image.new('RGBA',(w,h),(12,23,35,255))
    tile.alpha_composite(im,((w-im.width)//2,(h-im.height)//2))
    return tile

def panel(im,name,x,y,w,h,q=1,crop=None,caption=None):
    if q<=0:return
    card=Image.new('RGBA',(w+4,h+42))
    d=ImageDraw.Draw(card);d.rounded_rectangle((1,1,w+2,h+40),radius=15,fill=(12,23,35,255),outline=(61,94,116,255),width=2)
    for k in range(3):d.ellipse((18+k*17,15,24+k*17,21),fill=(71,101,122,255))
    tile=screenshot(name,w-4,h-4,crop)
    card.alpha_composite(tile,(4,34))
    mask=Image.new('L',card.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,w+3,h+41),radius=15,fill=255)
    card.putalpha(mask)
    put(im,card,x,y+(1-bezier(q))*70,clamp(q*2))
    if caption:text(im,caption,x+3,y+h+58,19,MUTED,opacity=clamp(q*2))

yy,xx=np.mgrid[0:H,0:W]
base=np.zeros((H,W,3),dtype=np.float32);base[:]=BG
for cx,cy,rad,col,power in [(1400,380,1000,(8,29,49),1),(320,850,850,(2,11,24),1)]:
    a=np.exp(-((xx-cx)**2+(yy-cy)**2)/(rad*rad))[:,:,None]
    base+=a*np.array(col)*power
BASE=Image.fromarray(np.clip(base,0,255).astype('uint8'),'RGB').convert('RGBA')
del base,xx,yy
stars=np.column_stack((RNG.uniform(0,W,480),RNG.uniform(0,H,480),RNG.uniform(.3,1.9,480),RNG.uniform(0,6.28,480)))
cloud=RNG.normal(size=(620,3));cloud/=np.linalg.norm(cloud,axis=1)[:,None]
cloud*=RNG.uniform(.1,1,620)[:,None]**.6
cloud[:,0]*=1.25
edges=[]
for i in range(0,len(cloud),2):
    dd=np.sum((cloud-cloud[i])**2,axis=1); close=np.argsort(dd)[1:4]
    edges.extend((i,int(j)) for j in close if dd[j]<.12)
RADAR=RNG.uniform(size=(520,3))

def backdrop(t,dim=1):
    im=BASE.copy();d=ImageDraw.Draw(im)
    for x,y,r,p in stars:
        a=(.25+.45*(.5+.5*math.sin(t*.9+p)))*dim
        col=tuple(int(v*a) for v in (147,195,223))
        x=(x+t*(r*.9))%W;y=(y+t*.35)%H
        d.ellipse((x-r,y-r,x+r,y+r),fill=col)
    return im
def network(im,t,cx=1370,cy=550,scale=430,alpha=1,expand=1):
    a=t*.065;ca,sa=math.cos(a),math.sin(a)
    pts=cloud.copy();x=pts[:,0]*ca+pts[:,2]*sa;z=-pts[:,0]*sa+pts[:,2]*ca
    y=pts[:,1]*.65+.17*np.sin(pts[:,0]*4+t*.25)
    p=1/(1+z*.22);px=cx+x*scale*p*expand;py=cy+y*scale*p*expand
    layer=Image.new('RGBA',im.size);d=ImageDraw.Draw(layer)
    for i,j in edges:
        c=rgba(BLUE,90*alpha)
        d.line((px[i],py[i],px[j],py[j]),fill=c,width=1)
    glow=Image.new('RGBA',im.size);gd=ImageDraw.Draw(glow)
    for i in np.argsort(z)[::-1]:
        r=(1.0+(1-z[i])*.9)*min(1.3,scale/400)
        col=GREEN if i%17==0 else GOLD if i%29==0 else BLUE
        br=alpha*(.4+.6*clamp((1-z[i])/2))
        d.ellipse((px[i]-r,py[i]-r,px[i]+r,py[i]+r),fill=rgba(col,255*br))
        if i%31==0:
            gd.ellipse((px[i]-11,py[i]-11,px[i]+11,py[i]+11),fill=rgba(col,80*alpha))
            d.ellipse((px[i]-2.5,py[i]-2.5,px[i]+2.5,py[i]+2.5),fill=rgba(WHITE,255*alpha))
    im.alpha_composite(layer)
    im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(15)))

def radar(im,t,cx=510,cy=565,r=345):
    d=ImageDraw.Draw(im)
    for f in [.28,.53,.77,1]:
        rr=r*f;d.ellipse((cx-rr,cy-rr,cx+rr,cy+rr),outline=(53,97,119),width=2)
    for a in range(0,360,30):
        z=math.radians(a);d.line((cx+math.cos(z)*r*.28,cy+math.sin(z)*r*.28,cx+math.cos(z)*r,cy+math.sin(z)*r),fill=(31,56,72),width=1)
    sweep=t*.7
    gl=Image.new('RGBA',im.size);gd=ImageDraw.Draw(gl)
    for k in range(30):
        a=sweep-k*.008
        gd.line((cx,cy,cx+r*math.cos(a),cy+r*math.sin(a)),fill=rgba(BLUE,50*(1-k/30)),width=3)
    im.alpha_composite(gl)
    d=ImageDraw.Draw(im)
    for i,(u,v,w) in enumerate(RADAR):
        a=u*math.tau;rr=r*(.34+.61*math.sqrt(v));x=cx+rr*math.cos(a);y=cy+rr*math.sin(a)
        delta=(sweep-a)%math.tau; glow=max(0,1-delta/.7);size=1.8+glow*3
        col=[BLUE,GREEN,GOLD][i%3]
        d.ellipse((x-size,y-size,x+size,y+size),fill=col)
        if glow>.3:d.ellipse((x-size-6,y-size-6,x+size+6,y+size+6),outline=rgba(col,130),width=1)
    text(im,'AI',cx,cy-40,61,WHITE,'bold','center')
    text(im,'RADAR',cx,cy+37,16,BLUE,'en','center')

def kicker(im,s,x,y,delay):text(im,s,x,y,24,BLUE,'en',reveal=delay/.7)
def brand_corner(im,opacity=1):
    logo=svg('xlab.svg',140);put(im,logo,125,70,opacity)
    text(im,'OPEN SOURCE INTELLIGENCE',300,80,18,MUTED,'en',opacity=opacity)
def divider(im,x,y,w=72):ImageDraw.Draw(im).line((x,y,x+w,y),fill=GREEN,width=4)
def module_label(im,index,name):
    text(im,index,128,77,22,BLUE,'en')
    text(im,'OPEN DIPPER / '+name,176,77,22,MUTED,'en')
def small_footer(im,s):text(im,s,128,988,19,MUTED)

def scene(index,u,t):
    im=backdrop(t,.65 if index in [2,3] else 1)
    if index==0:
        network(im,t,cx=1400,scale=440,expand=1.14-.08*bezier(u/4))
        brand_corner(im,bezier(u/.8))
        kicker(im,'A WORLD OF OPEN POSSIBILITIES',132,265,(u-.15))
        text(im,'开源世界，',128,350,106,WHITE,reveal=(u-.35)/1.0,weight=1)
        text(im,'正在连接。',128,500,106,BLUE,reveal=(u-.65)/1.,weight=1)
        text(im,'Every project is part of a bigger story.',133,680,30,MUTED,'en',opacity=bezier((u-1.2)/1))
        divider(im,134,773,100)
    elif index==1:
        network(im,t,cx=960,cy=530,scale=820,alpha=.24)
        d=ImageDraw.Draw(im)
        for k in range(3):
            r=250+90*k+18*math.sin(u*.5+k);d.arc((960-r,530-r,960+r,530+r),25+u*12+k*60,165+u*12+k*60,fill=(31,70,96),width=2)
        logo=svg('logo.svg',1090)
        put(im,logo,(W-logo.width)/2,245+(1-bezier(u/.9))*90,bezier(u/.7))
        text(im,'AI 与开源生态观测站',960,669,57,WHITE,align='center',reveal=(u-.45)/.95)
        text(im,'Explore the AI and open-source ecosystem',960,774,30,MUTED,'en','center',opacity=bezier((u-.9)/1))
        text(im,'BY X-LAB AI',960,902,21,BLUE,'en','center',opacity=bezier((u-1.2)/.8))
    elif index==2:
        module_label(im,'01','GLOBAL OBSERVATION')
        text(im,'全球观测',128,227,89,WHITE,reveal=u/.85,weight=1)
        text(im,'从世界，看见生态',128,364,45,BLUE,reveal=(u-.2)/.9)
        text(im,'A global perspective.',132,450,27,MUTED,'en')
        text(im,'246',128,590,108,BLUE,'bold',opacity=bezier((u-.5)/1))
        text(im,'国家和地区 · 上游统计覆盖',132,727,26,MUTED)
        text(im,'18 图层  /  地图 + 立体地球',132,832,27,WHITE)
        panel(im,'atlas-dark' if u<3.5 else 'atlas-light',690,188,1100,715,(u-.3)/.9,crop=(278,111,1351,925))
        small_footer(im,'OpenDigger / OpenShare · 来源快照更新 2026-10-08 · 画面中的模拟动态另行标识')
    elif index==3:
        module_label(im,'02','AI RADAR / FULL-DOMAIN PREVIEW')
        radar(im,t)
        text(im,'AI 雷达',990,207,89,WHITE,reveal=u/.85,weight=1)
        text(im,'面向全域数据，',990,341,51,BLUE,reveal=(u-.15)/.9)
        text(im,'发现你的下一步。',990,422,51,BLUE,reveal=(u-.3)/.9)
        text(im,'Discover across the open ecosystem.',994,520,24,MUTED,'en')
        for k,stat in enumerate(FACTS['radarFoundation']):
            x=994+k*264;qq=bezier((u-.7-.12*k)/1)
            ImageDraw.Draw(im).line((x,634,x+235,634),fill=(45,73,92),width=2)
            text(im,stat['display'],x,672,53,[BLUE,GREEN,GOLD][k],opacity=qq,weight=1)
            text(im,stat['label'],x,758,25,MUTED,opacity=qq)
        text(im,'全域能力预览 · 分阶段接入',994,856,31,GREEN)
        small_footer(im,'数据规模来自全球观测上游统计，不代表当前雷达收录量。概念动效，不逐点对应实体。')
    elif index==4:
        module_label(im,'03','OPEN GALAXY')
        network(im,t,cx=1510,cy=590,scale=650,alpha=.28)
        text(im,'开源星系',128,218,89,WHITE,reveal=u/.9,weight=1)
        text(im,'发现项目之间的联系',129,350,43,BLUE,reveal=(u-.2)/.95)
        text(im,'Explore the connections.',133,436,26,MUTED,'en')
        panel(im,'galaxy-dark' if u<4 else 'galaxy-light',725,208,1050,650,(u-.35)/1.2,crop=(260,152,1351,906))
        for k,(n,label,col) in enumerate([('19,771','代码仓库',BLUE),('24,000','模型 · 数据集 · Spaces',GREEN)]):
            y=555+k*185;qq=bezier((u-.8-k*.15)/.9)
            text(im,n,130,y,76,col,'bold',opacity=qq)
            text(im,label,132,y+107,27,MUTED,opacity=qq)
        small_footer(im,'固定网络快照 · 代码 2025.08—2026.07 / 模型 2026-08-05 · 动画不代表实时增长')
        text(im,'OpenDipper 1.6.0 · 真实界面',1248,940,22,MUTED,align='center')
    elif index==5:
        module_label(im,'04','WORLD TOUR')
        text(im,'五站巡航，一眼看见全局。',128,179,68,WHITE,reveal=u/.9,weight=1)
        labels=['活跃开发者','企业','标杆项目','模型资产','会议与活动']
        for k,label in enumerate(labels):
            x=130+k*335;active=min(4,int(u/1.25))==k
            text(im,f'{k+1:02d}',x,301,22,GREEN if active else MUTED,'en')
            text(im,label,x+50,295,30,WHITE if active else MUTED)
            ImageDraw.Draw(im).line((x,356,x+278,356),fill=GREEN if active else (40,70,87),width=3)
        panel(im,'atlas-light',128,400,795,490,bezier((u-.3)/.8),crop=(278,111,1351,812))
        panel(im,'tour-dark',990,400,795,490,bezier((u-.55)/.8),crop=(278,111,1351,812))
        text(im,'平面地图 · 全球分布',128,952,26,BLUE)
        text(im,'立体地球 · 企业巡航实景',990,952,26,GREEN)
    elif index==6:
        network(im,t,cx=960,cy=650,scale=950,alpha=.2)
        text(im,'让探索，成为下一步。',960,160,79,WHITE,align='center',reveal=u/.9,weight=1)
        text(im,'DISCOVER  /  CONNECT  /  TAKE IT WITH YOU',960,289,25,BLUE,'en','center',opacity=bezier((u-.35)/.8))
        for k in [0,2,1]:
            q=spring((u-.35-k*.12));cx=960+(k-1)*525*q;y=421+abs(k-1)*18*(1-q)
            card=result_card(k);ang=(k-1)*(-10)*(1-smooth((u-1.2)/1.8))
            if abs(ang)>.02:card=card.rotate(ang,Image.Resampling.BICUBIC,expand=True)
            put(im,card,cx-card.width/2,y+(1-q)*280,clamp(q))
        text(im,'Markdown · HTML · JSON',960,974,26,MUTED,'en','center',opacity=bezier((u-1.3)/.8))
    else:
        network(im,t,cx=960,cy=510,scale=920,alpha=.26)
        brand_corner(im,bezier(u/.8))
        logo=svg('logo.svg',850);put(im,logo,(W-logo.width)/2,178+(1-bezier(u/.9))*60,bezier(u/.7))
        text(im,'看见连接，发现可能。',960,550,80,WHITE,align='center',reveal=(u-.3)/.9,weight=1)
        text(im,'SEE THE CONNECTIONS. FIND YOUR POSSIBILITIES.',960,677,25,BLUE,'en','center',opacity=bezier((u-.6)/.9))
        q=bezier((u-1.0)/.85);d=ImageDraw.Draw(im)
        if q>0:
            pill=Image.new('RGBA',im.size)
            ImageDraw.Draw(pill).rounded_rectangle((688,764,1232,842),radius=39,fill=rgba(GREEN,int(255*q)))
            im.alpha_composite(pill)
            text(im,'立即试用 · 反馈共建',960,784,31,(12,27,17),align='center',opacity=q)
        text(im,'www.x-lab.info/open-dipper',960,889,29,WHITE,'en','center',opacity=q)
        text(im,'github.com/X-lab2017/open-dipper',960,953,25,MUTED,'en','center',opacity=q)
        text(im,'PREVIEW 1.6.0',1788,82,20,BLUE,'en','right',opacity=q)
    # Consistent editorial frame, generous 128 px safe area.
    d=ImageDraw.Draw(im)
    d.line((128,1038,1792,1038),fill=(31,52,69),width=1)
    d.line((128,1038,128+1664*clamp(t/DURATION),1038),fill=BLUE,width=2)
    return im

@lru_cache(maxsize=3)
def result_card(k):
    im=Image.new('RGBA',(480,477));d=ImageDraw.Draw(im)
    d.rounded_rectangle((0,0,479,476),radius=23,fill=(14,28,42,255),outline=(59,91,113,255),width=2)
    colors=[BLUE,GREEN,GOLD];titles=['发现项目','理解联系','带走报告'];en=['DISCOVER','CONNECT','EXPORT']
    text(im,'0'+str(k+1),32,27,23,colors[k],'en')
    text(im,titles[k],32,82,44,WHITE,weight=1)
    text(im,en[k],34,149,18,MUTED,'en')
    if k==0:
        for i,(s,label) in enumerate([('P','PyTorch'),('v','vLLM'),('H','Models & data')]):
            y=223+i*64;d.rounded_rectangle((30,y,449,y+51),radius=11,fill=(23,43,58,255))
            d.ellipse((45,y+12,70,y+37),fill=rgba(colors[i]))
            text(im,label,90,y+12,23,WHITE,'en')
    elif k==1:
        xy=[(88,270),(230,228),(380,275),(172,383),(338,390)]
        for i,j in [(0,1),(1,2),(0,3),(1,3),(1,4),(2,4),(3,4)]:d.line((*xy[i],*xy[j]),fill=(73,122,148),width=2)
        for i,(x,y) in enumerate(xy):d.ellipse((x-13,y-13,x+13,y+13),fill=colors[i%3])
    else:
        d.rounded_rectangle((95,207,384,427),radius=12,fill=(27,46,62,255),outline=(77,112,138,255),width=2)
        for i,w in enumerate([162,215,187,203,138]):d.rounded_rectangle((124,235+i*30,124+w,242+i*30),radius=3,fill=rgba(BLUE if i==0 else (81,109,128)))
        text(im,'SOURCES + EVIDENCE',124,399,14,GOLD,'en')
    return im

CUTS=[0,4,8,15,23,31,38,44,50]
def frame(t):
    i=min(7,max(0,next((k for k in range(8) if CUTS[k]<=t<CUTS[k+1]),7)))
    u=t-CUTS[i];im=scene(i,u,t)
    # A 0.45 s directional reveal ties the scenes together without flashy strobing.
    if i>0 and u<.45:
        prev=scene(i-1,t-CUTS[i-1],t);p=bezier(u/.45)
        # Full-frame blend plus restrained motion gives a clean editorial transition.
        im=Image.blend(prev,im,p)
    if t<.35:im=Image.blend(Image.new('RGBA',(W,H),BG),im,smooth(t/.35))
    return im.convert('RGB')

def soundtrack():
    sr=48000;N=sr*DURATION;a=np.zeros((N,2),np.float64);rng=np.random.default_rng(20261026)
    def add(sig,at,pan=0):
        start=int(at*sr);n=min(len(sig),N-start)
        if n<=0:return
        a[start:start+n,0]+=sig[:n]*math.sqrt((1-pan)/2)
        a[start:start+n,1]+=sig[:n]*math.sqrt((1+pan)/2)
    def note(freq,duration,amp,at,pan=0,pluck=False):
        tt=np.arange(int(sr*duration))/sr
        env=(1-np.exp(-tt/(.004 if pluck else .35)))*np.minimum(1,(duration-tt)/(.4 if pluck else .9))
        if pluck:env*=np.exp(-tt*3.4)
        sig=(np.sin(2*np.pi*freq*tt)+.2*np.sin(2*np.pi*freq*2.004*tt)+.08*np.sin(2*np.pi*freq*3*tt))*env*amp
        add(sig,at,pan)
    # Original D minor / B-flat / F / C progression, not a sampled track.
    chords=[[50,57,62,65],[46,53,58,62],[41,48,57,60],[48,55,60,64]]
    for bar in range(math.ceil(DURATION/4)):
        at=bar*4;notes=chords[bar%4]
        for k,m in enumerate(notes):note(440*2**((m-69)/12),4.7,.035,at,(k-1.5)/3)
        for b in range(8):
            beat=at+b*.5
            if beat>=4:
                note(440*2**((notes[0]-12-69)/12),.43,.11,beat,0,True)
                tt=np.arange(int(sr*.25))/sr
                phase=2*np.pi*(47*tt+75*.027*(1-np.exp(-tt/.027)))
                kick=np.sin(phase)*np.exp(-tt*17)*.18
                add(kick,beat)
            if 8<=beat<44:
                m=notes[(b*3)%4]+12
                note(440*2**((m-69)/12),1,.07,beat+.25,(-.6 if b%2 else .6),True)
                note(440*2**((m-69)/12),.6,.02,beat+.625,(.6 if b%2 else -.6),True)
            if 15<=beat<44:
                tt=np.arange(int(sr*.055))/sr;noise=rng.normal(0,1,len(tt));noise=np.r_[0,np.diff(noise)]
                add(noise*np.exp(-tt*95)*.012,beat+.25,(-.3 if b%2 else .3))
    for at in CUTS[1:-1]:
        tt=np.arange(int(sr*.8))/sr;noise=rng.normal(0,1,len(tt))
        noise=np.convolve(noise,np.ones(13)/13,mode='same')
        sig=noise*np.sin(np.pi*np.arange(len(tt))/len(tt))**2*.07
        add(sig,max(0,at-.3),-.25)
        note(880,.9,.045,at,.3,True)
    # Stereo echoes, smooth intro/outro and controlled peaks.
    delay=int(.25*sr);a[delay:]+=a[:-delay,::-1]*.18
    tt=np.arange(N)/sr;env=np.minimum(1,tt/1.5)*np.minimum(1,(DURATION-tt)/2.0)
    a*=env[:,None];a=np.tanh(a*1.3)
    peak=np.max(np.abs(a));a*=.8/max(.8,peak)
    pcm=(a*32767).astype('<i2')
    with wave.open(str(OUT/'soundtrack.wav'),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes(pcm.tobytes())
    print('Original soundtrack ready',flush=True)

def render():
    out=OUT/'OpenDipper-Promo-v2-1080p.mp4'
    cmd=['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i',str(OUT/'soundtrack.wav'),'-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af','loudnorm=I=-16:TP=-1.5:LRA=10','-ar','48000','-t',str(DURATION),'-movflags','+faststart',str(out)]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE);start=time.time()
    try:
        for n in range(FPS*DURATION):
            p.stdin.write(frame(n/FPS).tobytes())
            if n%(FPS*2)==0:print(f'Frame {n}/{FPS*DURATION} | {time.time()-start:.1f}s',flush=True)
    finally:p.stdin.close()
    if p.wait():raise RuntimeError('ffmpeg failed')
    print(out,flush=True)

if __name__=='__main__':
    pa=argparse.ArgumentParser();pa.add_argument('--preview',action='store_true');pa.add_argument('--audio',action='store_true');pa.add_argument('--render',action='store_true');args=pa.parse_args()
    if args.preview:
        times=[2.6,6.5,11.2,19.2,27.8,35.4,41.0,47.0]
        thumbs=[]
        for i,t in enumerate(times):
            f=frame(t);f.save(OUT/f'preview-{i+1:02d}.png');thumbs.append(f.resize((640,360),Image.Resampling.LANCZOS))
        sheet=Image.new('RGB',(1280,4*400),(8,14,23));d=ImageDraw.Draw(sheet)
        for i,thumb in enumerate(thumbs):
            x=(i%2)*640;y=(i//2)*400;sheet.paste(thumb,(x,y));d.text((x+20,y+366),f'{times[i]:04.1f}s',font=font(20,'en'),fill=WHITE)
        sheet.save(OUT/'contact-sheet.jpg',quality=92)
        frame(47).save(OUT/'OpenDipper-Promo-Cover.png')
        print('Preview ready',flush=True)
    if args.audio:soundtrack()
    if args.render:
        if not (OUT/'soundtrack.wav').exists():soundtrack()
        render()
