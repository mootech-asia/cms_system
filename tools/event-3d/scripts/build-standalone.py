from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
assets=root/'dist/assets'
(root/'standalone').mkdir(exist_ok=True)
js=next(assets.glob('demo-*.js')).read_text()
m=re.search(r'export\{(\w+) as n,(\w+) as t\};?\s*$',js)
assert m, 'Build export names changed; update standalone bundler.'
create,rewards=m.groups()
js=js[:m.start()]
css=next(assets.glob('demo-*.css')).read_text()
css=re.sub(r'@import\s+(?:url\([^)]*\)|"[^"]*"|\'[^\']*\')\s*;', '', css)
for mode,title in [('card-pack','拆卡包'),('blind-box','拆盲盒')]:
 bootstrap='''
let current, mode = MODE;
function mount() {
 current?.destroy();
 current = CREATE(document.querySelector('#app'), {type:mode,coverUrl:null,resolveRewards:REWARDS});
 document.title = mode === 'card-pack' ? '3D 拆卡包' : '3D 拆盲盒';
 const links=document.querySelectorAll('header a');
 links[0].href='#'; links[0].onclick=e=>{e.preventDefault();mount();};
 links[1].href='#'; links[1].onclick=e=>{e.preventDefault();mode=mode==='card-pack'?'blind-box':'card-pack';mount();};
}
mount();
'''.replace('MODE',repr(mode)).replace('CREATE',create).replace('REWARDS',rewards)
 html='<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>'+css+'</style></head><body><div id="app"></div><script type="module">'+(js+bootstrap).replace('</script','<\\/script')+'</script></body></html>'
 (root/'standalone'/f'{mode}.html').write_text(html)
print('Created offline single-file previews')

# Copy the generated standalone pages to their independently published event entries.
import shutil
for mode, folder in [('card-pack','20261118_card_pack'),('blind-box','20261118_blind_box')]:
    destination = root.parents[1] / 'event' / folder / 'index.html'
    shutil.copyfile(root/'standalone'/f'{mode}.html', destination)
