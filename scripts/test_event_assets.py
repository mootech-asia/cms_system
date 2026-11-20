"""Verify complete theme scaffolding and reject missing, altered, or stray media."""
import contextlib
import hashlib
import io
import json
from pathlib import Path
import runpy
import tempfile
import unittest
from PIL import Image

API=runpy.run_path(str(Path(__file__).with_name('event-assets.py')))

class AssetContract(unittest.TestCase):
    def test_all_four_game_profiles_inherit_every_slot(self):
        data=API['load']()
        for event in sorted({a['event'] for a in data['assets']} - {'shared'}):
            with self.subTest(event=event), tempfile.TemporaryDirectory() as temp:
                dest=Path(temp)/'event'
                with contextlib.redirect_stdout(io.StringIO()):
                    API['init'](data,event,'20261201_theme_test',dest)
                rows=[a for a in data['assets'] if a['event']==event]
                brief=(dest/'docs/ASSETS.md').read_text()
                self.assertEqual(brief.count('| ☐ |'),len(rows))
                for row in rows:
                    self.assertIn(row['id'],brief)
                    self.assertIn(row['purpose'],brief)
                for category in API['CATEGORIES']:
                    self.assertTrue((dest/'assets'/category/'README.md').exists())
                    self.assertTrue((dest/'source'/category/'README.md').exists())
                self.assertFalse(any(p.suffix in API['MEDIA'] for p in dest.rglob('*')))
                with self.assertRaises(SystemExit),contextlib.redirect_stdout(io.StringIO()):
                    API['init'](data,event,'20261201_theme_test',dest)

    def test_delivery_validation_rejects_omissions_and_stray_files(self):
        check=API['check'];scope=check.__globals__;old_root=scope['ROOT'];old_configs=scope['configs']
        try:
            with tempfile.TemporaryDirectory() as temp:
                scope['ROOT']=Path(temp);event='20261201_theme_test';root=Path(temp)/'event'/event
                path='assets/images/theme_test_IMG001_stage-bg.png';p=root/path;p.parent.mkdir(parents=True)
                Image.new('RGBA',(8,8),(255,0,0,255)).save(p)
                (root/'docs').mkdir();(root/'docs/ASSETS.md').write_text('spec')
                (root/'index.html').write_text('')
                for c in API['CATEGORIES']:
                    (root/'assets'/c).mkdir(exist_ok=True);(root/'assets'/c/'README.md').write_text('spec')
                scope['configs']=lambda:{event:[{'slot':'images.stageBg','value':path}]}
                row={'event':event,'id':'IMG001','category':'images','path':path,'purpose':'主背景','width':8,'height':8,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
                data={'assets':[row],'sources':[]}
                def verify():
                    out=io.StringIO()
                    with contextlib.redirect_stdout(out):result=check(data)
                    return result,out.getvalue()
                self.assertEqual(verify()[0],0)
                image=p.read_bytes();p.unlink();code,log=verify();self.assertEqual(code,1);self.assertIn('缺少交付檔',log);p.write_bytes(image)
                stray=p.parent/'unused.png';stray.write_bytes(image);code,log=verify();self.assertEqual(code,1);self.assertIn('未列入素材表',log);stray.unlink()
                row['width']=9;code,log=verify();self.assertEqual(code,1);self.assertIn('尺寸不符',log);row['width']=8
                row['sha256']='bad';code,log=verify();self.assertEqual(code,1);self.assertIn('指紋',log)
        finally:scope['ROOT']=old_root;scope['configs']=old_configs

if __name__=='__main__':unittest.main()
