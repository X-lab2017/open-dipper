#!/usr/bin/env python3
"""Rebuild OpenDipper brand 1.1 as deterministic path-only SVGs.

Keep the accepted seven-star geometry; the 1.1 revision opens the lockup spacing.
Requires fontTools and Noto Sans CJK SC Bold / DejaVu Sans Bold, not runtime fonts.
Use --raster to refresh transparent PNG, favicon and Apple touch-icon derivatives
(requires CairoSVG and Pillow). Normal application builds use committed assets.
"""
from pathlib import Path
import argparse, hashlib, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/brand/opendipper'; OUT.mkdir(parents=True,exist_ok=True)
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--zh-font',type=Path,default=Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'))
parser.add_argument('--latin-font',type=Path,default=Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
parser.add_argument('--raster',action='store_true')
args=parser.parse_args()
for font_path in [args.zh_font,args.latin_font]:
 if not font_path.is_file(): parser.error(f'Font not found: {font_path}; pass --zh-font / --latin-font explicitly.')
zh=TTFont(str(args.zh_font),fontNumber=2 if args.zh_font.suffix.lower()=='.ttc' else -1)
en=TTFont(str(args.latin_font))
def text_path(text,font,x,y,width,height,tracking=0):
 gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm
 adv=sum(font['hmtx'][cmap[ord(c)]][0] for c in text)
 scale=(width-tracking*(len(text)-1))/adv; paths=[]; cursor=x
 for c in text:
  name=cmap[ord(c)]; pen=SVGPathPen(gs)
  gs[name].draw(TransformPen(pen,(scale,0,0,-height/upm,cursor,y)))
  paths.append(pen.getCommands()); cursor+=font['hmtx'][name][0]*scale+tracking
 return '<path d="'+' '.join(paths)+'"/>'
def icon(color,star,small=False):
 if small:
  return f'<g fill="none" stroke="{color}" stroke-width="29" stroke-linecap="round"><path d="M110 130 A140 140 0 0 1 308 40"/><path d="M378 139 A140 140 0 0 1 110 200"/></g><path fill="{star}" d="M350 62 L363 91 L392 104 L363 117 L350 146 L337 117 L308 104 L337 91Z"/>'
 return f'<g fill="none" stroke="{color}" stroke-width="18" stroke-linecap="butt"><path d="M119 112 A140 140 0 0 1 323 41"/><path d="M381 115 A140 140 0 1 1 110 179"/></g><path d="M30 170 L94 135 L164 163 L229 207 L240 138 L323 118 L314 195 L229 207" fill="none" stroke="{color}" stroke-width="10" stroke-linejoin="round"/><g fill="{color}">'+''.join(f'<circle cx="{x}" cy="{y}" r="15"/>' for x,y in [(30,170),(94,135),(164,163),(229,207),(240,138),(323,118),(314,195)])+f'</g><path fill="{star}" stroke="{star}" stroke-width="6" stroke-linejoin="round" d="M350 48 L360 72 L383 83 L360 94 L350 118 L340 94 L317 83 L340 72Z"/>'
palettes={'dark':('#69B9E9','#9AD744','#E5EDF5'),'light':('#17638E','#9AD744','#080D15'),'black':('#000000','#000000','#000000'),'white':('#FFFFFF','#FFFFFF','#FFFFFF')}
# Coordinates are in the SVG viewBox, not display pixels. All lockups preserve
# the accepted mark; tracking and row separation are explicit reusable inputs.
layout={
 'horizontal':{'canvas':[1040,320],'chinese':[475,147,540,127,6],'english':[480,268,530,91,2.4]},
 'english':{'canvas':[1040,320],'iconTransform':'translate(10 65) scale(0.6)','english':[315,210,700,150,2.8]},
 'stacked':{'canvas':[600,580],'chinese':[70,433,460,106,5],'english':[76,539,448,84,2]},
}
manifest=[]
for theme,(color,star,ink) in palettes.items():
 for kind in ['icon','small','horizontal','english','stacked']:
  w,h=(320,320) if kind=='small' else (400,320); content=icon(color,star,kind=='small')
  viewbox='80 0 320 320' if kind=='small' else None
  if kind in ['horizontal','english']:
   w,h=(1040,320)
   if kind=='horizontal': content+=f'<g fill="{ink}">'+text_path('开源北斗',zh,*layout[kind]['chinese'])+text_path('OpenDipper',en,*layout[kind]['english'])+'</g>'
   else:
    content=f'<g transform="{layout[kind]["iconTransform"]}">'+content+'</g>'
    content+=f'<g fill="{ink}">'+text_path('OpenDipper',en,*layout[kind]['english'])+'</g>'
  if kind=='stacked':
   w,h=layout[kind]['canvas'];content='<g transform="translate(100 0)">'+content+'</g>'
   content+=f'<g fill="{ink}">'+text_path('开源北斗',zh,*layout[kind]['chinese'])+text_path('OpenDipper',en,*layout[kind]['english'])+'</g>'
  name=f'opendipper-{kind}-{theme}.svg'
  box=viewbox or f'0 0 {w} {h}'
  (OUT/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" width="{w}" height="{h}" role="img" aria-label="开源北斗 OpenDipper"><title>开源北斗 · OpenDipper</title>{content}</svg>\n')
  manifest.append({'file':name,'variant':kind,'theme':theme,'width':w,'height':h})
(OUT/'manifest.json').write_text(json.dumps({
 'version':'1.1.0','date':'2026-10-26',
 'revision':'More space between symbol and wordmark, between bilingual rows, and between outlined letters. Accepted icon geometry and file URLs are unchanged.',
 'layoutUnits':'SVG viewBox units; text arrays are x, baseline, total advance, em height, tracking',
 'layout':layout,
 'sourceFonts':[
  {'family':'Noto Sans CJK SC Bold','sha256':hashlib.sha256(args.zh_font.read_bytes()).hexdigest()},
  {'family':'DejaVu Sans Bold','sha256':hashlib.sha256(args.latin_font.read_bytes()).hexdigest()},
 ],
 'assets':manifest,
},ensure_ascii=False,indent=2)+'\n')
print('Generated',len(manifest),'SVG identity variants')
if args.raster:
 import cairosvg
 from PIL import Image
 for item in manifest:
  cairosvg.svg2png(url=str(OUT/item['file']),write_to=str(OUT/item['file'].replace('.svg','@2x.png')),output_width=item['width']*2,output_height=item['height']*2)
 for size in [16,32,48]:
  cairosvg.svg2png(url=str(OUT/'opendipper-small-dark.svg'),write_to=str(OUT/f'favicon-{size}.png'),output_width=size,output_height=size)
 cairosvg.svg2png(url=str(OUT/'opendipper-small-dark.svg'),write_to=str(OUT/'apple-touch-icon.png'),output_width=180,output_height=180)
 with Image.open(OUT/'opendipper-small-dark@2x.png') as icon_image:
  icon_image.save(OUT/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
 print('Generated 20 transparent PNGs, 3 favicon PNGs, ICO and Apple touch icon')
