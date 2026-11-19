from pathlib import Path
import math
P=Path(__file__).resolve().parents[1]/'assets/img'
D='''<defs>
<linearGradient id="gold" x2=".25" y2="1"><stop stop-color="#fff6bf"/><stop offset=".22" stop-color="#f8d574"/><stop offset=".48" stop-color="#d38b28"/><stop offset=".7" stop-color="#fff0ac"/><stop offset="1" stop-color="#a65b19"/></linearGradient>
<linearGradient id="red" x2=".1" y2="1"><stop stop-color="#ff8470"/><stop offset=".4" stop-color="#db3b4b"/><stop offset="1" stop-color="#9d213c"/></linearGradient>
<linearGradient id="cream" x2="0" y2="1"><stop stop-color="#fffdf1"/><stop offset="1" stop-color="#ffe3ba"/></linearGradient>
<linearGradient id="blue" x2=".4" y2="1"><stop stop-color="#8ee8fa"/><stop offset=".5" stop-color="#36b7dc"/><stop offset="1" stop-color="#186dba"/></linearGradient>
<linearGradient id="mint" x2=".4" y2="1"><stop stop-color="#b2f7d0"/><stop offset="1" stop-color="#249f88"/></linearGradient>
<radialGradient id="wall"><stop stop-color="#fffef3"/><stop offset=".65" stop-color="#ffe9c7"/><stop offset="1" stop-color="#f4c695"/></radialGradient>
<linearGradient id="velvet"><stop stop-color="#98263f"/><stop offset=".2" stop-color="#ea5c58"/><stop offset=".4" stop-color="#b63045"/><stop offset=".65" stop-color="#f17a67"/><stop offset=".85" stop-color="#ad2c42"/><stop offset="1" stop-color="#d94b51"/></linearGradient>
</defs>'''
def save(n,w,h,s):
 (P/(n+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'+D+s+'</svg>')
def star(x,y,r,fill='#fff3b8'):
 pts=[]
 for i in range(8):
  a=i*math.pi/4; rr=r if i%2==0 else r*.25;pts.append(f'{x+math.sin(a)*rr:.2f},{y-math.cos(a)*rr:.2f}')
 return f'<polygon points="{" ".join(pts)}" fill="{fill}"/>'
s='<path fill="url(#wall)" d="M0 0h750v1000H0z"/>'
for x in range(-600,1400,160): s+=f'<path d="M375 160L{x} 1000h70Z" fill="#fff8df" opacity=".25"/>'
s+='<path d="M0 0H140C145 260 90 405 62 650L28 1000H0Z" fill="url(#velvet)"/><path d="M750 0H610C605 260 660 405 688 650L722 1000H750Z" fill="url(#velvet)"/>'
for x in [14,42,72,101]:
 s+=f'<path d="M{x} 30Q{x+22} 300 {x/2} 680" fill="none" stroke="#ffd0a0" stroke-opacity=".22" stroke-width="5"/><path d="M{750-x} 30Q{728-x} 300 {750-x/2} 680" fill="none" stroke="#ffd0a0" stroke-opacity=".22" stroke-width="5"/>'
s+='<path d="M0 0H750V65Q562 176 375 64Q188 176 0 65Z" fill="url(#velvet)"/><path d="M0 65Q188 176 375 64Q562 176 750 65" fill="none" stroke="url(#gold)" stroke-width="12"/>'
for x in range(0,751,13):
 y=65+50*abs(math.sin(x/375*math.pi));s+=f'<path d="M{x} {y}v18" stroke="#eebc58" stroke-width="3"/>'
for x,y,r in [(180,220,9),(580,240,11),(150,750,8),(620,630,7),(540,850,8)]:s+=star(x,y,r,'#dfae68')
s+='<path d="M0 920Q375 870 750 920V1000H0Z" fill="#edc396"/>'
save('stage-bg',750,1000,s)
s='<path d="M0 0H750V140H0Z" fill="#fff6ea"/><path d="M0 0Q375 43 750 0V65Q375 130 0 65Z" fill="url(#gold)"/><path d="M0 0Q375 43 750 0V27Q375 70 0 27Z" fill="#a95830"/><path d="M0 4Q375 47 750 4" fill="none" stroke="#ffe8a2" stroke-width="5"/>'
for x in range(20,750,42):
 y=24+20*math.sin(math.pi*x/750);s+=f'<circle cx="{x}" cy="{y}" r="9" fill="#cc862f"/><circle cx="{x}" cy="{y}" r="6" fill="#fff8d6"/><circle cx="{x-1}" cy="{y-2}" r="2" fill="white"/>'
save('stage-floor',750,140,s)
# Hollow frame: all strokes remain at radius >=300.
s='<circle cx="340" cy="340" r="337" fill="none" stroke="#ae6525" stroke-width="6"/><circle cx="340" cy="340" r="320" fill="none" stroke="url(#gold)" stroke-width="40"/><circle cx="340" cy="340" r="334" fill="none" stroke="#fff3ba" stroke-width="4"/><circle cx="340" cy="340" r="317" fill="none" stroke="#975120" stroke-width="18"/><circle cx="340" cy="340" r="303" fill="none" stroke="#ffdf85" stroke-width="6"/>'
save('wheel-frame',680,680,s)
save('wheel-gloss',600,600,'<defs><radialGradient id="shade"><stop offset=".72" stop-color="#4c1228" stop-opacity="0"/><stop offset="1" stop-color="#4c1228" stop-opacity=".28"/></radialGradient><linearGradient id="shine" x2="0" y2="1"><stop stop-color="white" stop-opacity=".38"/><stop offset=".6" stop-color="white" stop-opacity="0"/></linearGradient><clipPath id="disc"><circle cx="300" cy="300" r="300"/></clipPath></defs><circle cx="300" cy="300" r="300" fill="url(#shade)"/><path d="M0 0H600V190Q300 350 0 230Z" fill="url(#shine)" clip-path="url(#disc)"/>')
save('pointer',120,160,'<path d="M60 157L13 51Q0 8 60 6Q120 8 107 51Z" fill="url(#gold)" stroke="#9a5221" stroke-width="3"/><path d="M60 135L30 50Q20 24 60 22Q100 24 90 50Z" fill="url(#red)"/><path d="M60 128V30Q38 29 38 48Z" fill="#fff" opacity=".2"/><circle cx="60" cy="46" r="11" fill="url(#gold)"/>')
save('btn-go',200,200,'<circle cx="100" cy="100" r="98" fill="#a15d26"/><circle cx="100" cy="96" r="94" fill="url(#gold)"/><circle cx="100" cy="96" r="80" fill="#8e253a"/><circle cx="100" cy="91" r="75" fill="url(#red)"/><path d="M42 59Q100 15 158 59" fill="none" stroke="#ffb29b" stroke-width="4" stroke-linecap="round"/>')
save('btn-primary',400,110,'<rect x="3" y="7" width="394" height="100" rx="50" fill="#9e5122"/><rect x="3" y="2" width="394" height="100" rx="50" fill="url(#gold)"/><rect x="10" y="9" width="380" height="85" rx="43" fill="url(#red)"/><path d="M50 20H350" stroke="#ffb39b" stroke-width="3" stroke-linecap="round"/>')
save('spotlight',260,900,'<defs><linearGradient id="beam" x2="0" y2="1"><stop stop-color="#fffbe1" stop-opacity=".8"/><stop offset=".5" stop-color="#fff1bd" stop-opacity=".28"/><stop offset="1" stop-color="#fff1bd" stop-opacity="0"/></linearGradient></defs><path d="M116 0H144L260 900H0Z" fill="url(#beam)"/>')
s='<rect x="24" y="38" width="552" height="700" rx="70" fill="url(#gold)"/><rect x="37" y="50" width="526" height="674" rx="59" fill="url(#cream)"/><rect x="49" y="65" width="502" height="647" rx="49" fill="none" stroke="#dcad62" stroke-width="2"/><path d="M0 30H600L572 72L600 114H0L28 72Z" fill="#a52b41"/><rect x="36" y="20" width="528" height="90" rx="18" fill="url(#red)" stroke="url(#gold)" stroke-width="5"/><circle cx="300" cy="290" r="139" fill="#ffedc8"/><circle cx="300" cy="290" r="126" fill="none" stroke="#ecca8d" stroke-width="2" stroke-dasharray="3 12"/>'
for x,y,r in [(110,180,13),(485,200,18),(100,380,19),(490,392,10)]:s+=star(x,y,r,'#e9b64f')
save('modal-bg',600,760,s)
for locale,label,font,size in [('en','LUCKY WHEEL','DejaVu Sans',67),('ko','행운의 룰렛','Noto Sans CJK KR',70),('th','วงล้อนำโชค','Noto Sans Thai',76)]:
 s='<path d="M36 60L95 26H595L654 60V177L595 214H95L36 177Z" fill="#a35a26"/><path d="M36 53L95 19H595L654 53V170L595 207H95L36 170Z" fill="url(#gold)"/><path d="M57 64L103 38H587L633 64V159L587 187H103L57 159Z" fill="url(#red)" stroke="#8b2638" stroke-width="3"/>'
 for x in range(107,590,32):
  for y in [28,198]:s+=f'<circle cx="{x}" cy="{y}" r="4" fill="#fffbdc"/>'
 s+=f'<text x="345" y="139" text-anchor="middle" font-family="{font}" font-weight="900" font-size="{size}" fill="#7e2534" stroke="#7e2534" stroke-width="3">{label}</text><text x="345" y="132" text-anchor="middle" font-family="{font}" font-weight="900" font-size="{size}" fill="#fff2be" stroke="#fff2be" stroke-width=".6">{label}</text>'
 s+=star(34,114,22)+star(656,114,22)
 save('title-'+locale,690,240,s)
for off in [False,True]:
 s='<circle cx="32" cy="32" r="30" fill="url(#gold)"/><circle cx="32" cy="31" r="25" fill="url(#red)"/><path d="M15 26H23L33 18V45L23 37H15Z" fill="#fff5d7"/>'
 s+= '<path d="M40 25L51 38M51 25L40 38" stroke="#fff5d7" stroke-width="4" stroke-linecap="round"/>' if off else '<path d="M40 25Q48 32 40 39M46 19Q60 32 46 45" fill="none" stroke="#fff5d7" stroke-width="3" stroke-linecap="round"/>'
 save('icon-sound-'+('off' if off else 'on'),64,64,s)
# Prize silhouettes remain legible at 40px; no localized type.
icons={
'cash':'<g transform="rotate(-12 80 80)"><rect x="16" y="42" width="128" height="82" rx="12" fill="#187b69"/><rect x="16" y="34" width="128" height="82" rx="12" fill="url(#mint)" stroke="#e4ffe5" stroke-width="4"/><rect x="28" y="46" width="104" height="58" rx="8" fill="none" stroke="#187b69" stroke-width="3"/><ellipse cx="80" cy="75" rx="22" ry="26" fill="#efffd7"/><path d="M80 59V91M70 65H85Q96 71 80 75Q63 79 73 85H90" fill="none" stroke="#268e71" stroke-width="5"/></g>',
'coin':'<ellipse cx="80" cy="124" rx="60" ry="21" fill="#a76521"/><ellipse cx="80" cy="115" rx="60" ry="21" fill="url(#gold)"/><ellipse cx="80" cy="101" rx="55" ry="20" fill="#b87525"/><ellipse cx="80" cy="93" rx="55" ry="20" fill="url(#gold)"/><circle cx="80" cy="61" r="43" fill="url(#gold)" stroke="#b77420" stroke-width="4"/><circle cx="80" cy="61" r="32" fill="none" stroke="#fff0ac" stroke-width="3"/>'+star(80,61,22,'#b67c25'),
'gift':'<rect x="27" y="65" width="106" height="75" rx="9" fill="url(#red)"/><rect x="20" y="53" width="120" height="29" rx="7" fill="#f87674"/><path d="M72 54H89V140H72Z" fill="url(#gold)"/><path d="M79 53C13 58 37 0 66 29L80 52C143 59 123 0 94 29Z" fill="url(#gold)" stroke="#ffe9a2" stroke-width="3"/>',
'spin':'<circle cx="80" cy="80" r="56" fill="url(#blue)"/><path d="M42 68A40 40 0 0 1 111 50L104 31L135 57L103 69L112 53A33 33 0 0 0 48 71Z" fill="#fff8db"/><path d="M118 92A40 40 0 0 1 49 110L56 129L25 103L57 91L48 107A33 33 0 0 0 112 89Z" fill="#fff8db"/>'+star(80,80,20),
'bonus':'<path d="M80 13L98 36L127 32L129 61L149 80L129 99L127 128L98 124L80 147L62 124L33 128L31 99L11 80L31 61L33 32L62 36Z" fill="url(#gold)"/><circle cx="80" cy="80" r="42" fill="url(#red)"/><path d="M80 56V104M56 80H104" stroke="#fff3c8" stroke-width="14" stroke-linecap="round"/>',
'points':'<path d="M80 13L100 54L146 60L113 93L120 139L80 117L40 139L47 93L14 60L60 54Z" fill="url(#gold)" stroke="#b97825" stroke-width="4"/><path d="M80 29L80 100L48 122L54 90L31 67L67 62Z" fill="#fff0a5"/><circle cx="80" cy="80" r="13" fill="#edaa3d"/>',
 'thanks':'<path d="M80 137C13 100 8 73 25 49C44 23 68 41 80 56C92 41 116 23 135 49C152 73 147 100 80 137Z" fill="url(#red)"/><path d="M36 63Q44 46 58 55" fill="none" stroke="#ffb9a3" stroke-width="8" stroke-linecap="round"/>'+star(126,28,17)
}
for n,s in icons.items():save('icon-'+n,160,160,s)
print('21 static SVG assets generated')
