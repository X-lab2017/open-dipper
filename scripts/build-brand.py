#!/usr/bin/env python3
"""Rebuild the approved OpenDipper identity as deterministic path-only SVGs.
Requires fonttools and Noto Sans CJK Bold / DejaVu Sans Bold, not runtime fonts.
The raster concept is a design reference; these are newly typeset production vectors.
"""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/brand/opendipper'; OUT.mkdir(parents=True,exist_ok=True)
zh=TTFont('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',fontNumber=2)
en=TTFont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
def text_path(text,font,x,y,width,height):
 gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm
 adv=sum(font['hmtx'][cmap[ord(c)]][0] for c in text)
 scale=width/adv; paths=[]; cursor=x
 for c in text:
  name=cmap[ord(c)]; pen=SVGPathPen(gs)
  gs[name].draw(TransformPen(pen,(scale,0,0,-height/upm,cursor,y)))
  paths.append(pen.getCommands()); cursor+=font['hmtx'][name][0]*scale
 return '<path d="'+' '.join(paths)+'"/>'
def icon(color,star,small=False):
 if small:
  return f'<g fill="none" stroke="{color}" stroke-width="29" stroke-linecap="round"><path d="M110 130 A140 140 0 0 1 308 40"/><path d="M378 139 A140 140 0 0 1 110 200"/></g><path fill="{star}" d="M350 62 L363 91 L392 104 L363 117 L350 146 L337 117 L308 104 L337 91Z"/>'
 return f'<g fill="none" stroke="{color}" stroke-width="18" stroke-linecap="butt"><path d="M119 112 A140 140 0 0 1 323 41"/><path d="M381 115 A140 140 0 1 1 110 179"/></g><path d="M30 170 L94 135 L164 163 L229 207 L240 138 L323 118 L314 195 L229 207" fill="none" stroke="{color}" stroke-width="10" stroke-linejoin="round"/><g fill="{color}">'+''.join(f'<circle cx="{x}" cy="{y}" r="15"/>' for x,y in [(30,170),(94,135),(164,163),(229,207),(240,138),(323,118),(314,195)])+f'</g><path fill="{star}" stroke="{star}" stroke-width="6" stroke-linejoin="round" d="M350 48 L360 72 L383 83 L360 94 L350 118 L340 94 L317 83 L340 72Z"/>'
palettes={'dark':('#69B9E9','#9AD744','#E5EDF5'),'light':('#17638E','#9AD744','#080D15'),'black':('#000000','#000000','#000000'),'white':('#FFFFFF','#FFFFFF','#FFFFFF')}
manifest=[]
for theme,(color,star,ink) in palettes.items():
 for kind in ['icon','small','horizontal','english','stacked']:
  w,h=(320,320) if kind=='small' else (400,320); content=icon(color,star,kind=='small')
  viewbox='80 0 320 320' if kind=='small' else None
  if kind in ['horizontal','english']:
   w,h=(1040,320)
   if kind=='horizontal': content+=f'<g fill="{ink}">'+text_path('开源北斗',zh,445,170,570,137)+text_path('OpenDipper',en,450,258,565,104)+'</g>'
   else: content+=f'<g fill="{ink}">'+text_path('OpenDipper',en,445,208,570,122)+'</g>'
  if kind=='stacked':
   w,h=600,550;content='<g transform="translate(100 0)">'+content+'</g>'
   content+=f'<g fill="{ink}">'+text_path('开源北斗',zh,60,443,480,117)+text_path('OpenDipper',en,65,520,470,88)+'</g>'
  name=f'opendipper-{kind}-{theme}.svg'
  box=viewbox or f'0 0 {w} {h}'
  (OUT/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" width="{w}" height="{h}" role="img" aria-label="开源北斗 OpenDipper"><title>开源北斗 · OpenDipper</title>{content}</svg>\n')
  manifest.append({'file':name,'variant':kind,'theme':theme,'width':w,'height':h})
(OUT/'manifest.json').write_text(json.dumps({'version':'1.0.0','date':'2026-10-25','assets':manifest},ensure_ascii=False,indent=2)+'\n')
print('Generated',len(manifest),'SVG identity variants')
