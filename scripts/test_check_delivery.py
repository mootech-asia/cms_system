"""Regression checks for standalone call GIFs versus switchable mascot loops."""
import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest
from PIL import Image, ImageDraw

module_spec=importlib.util.spec_from_file_location('delivery',Path(__file__).with_name('check_delivery.py'))
delivery=importlib.util.module_from_spec(module_spec)
argv=sys.argv;sys.argv=['check_delivery.py','unused/DELIVERY_CHECKLIST.md']
module_spec.loader.exec_module(delivery);sys.argv=argv

class GifRules(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();delivery.ROOT=self.tmp.name
    def tearDown(self):self.tmp.cleanup()
    def make(self,path,duration=120,loop=0,transparent=False,seam=True):
        p=Path(self.tmp.name)/path;p.parent.mkdir(parents=True,exist_ok=True)
        frames=[]
        for i in range(25):
            frame=Image.new('RGBA',(64,64),(0,0,0,0) if transparent else (10,20,30,255))
            ImageDraw.Draw(frame).rectangle((20,20,43,43),fill=(100+i*4,150,200,255));frames.append(frame)
        if seam:frames[-1]=frames[0].copy()
        frames[0].save(p,save_all=True,append_images=frames[1:],duration=duration,loop=loop,disposal=2,optimize=False)
        return frames[0]
    def test_standalone_full_bleed_no_base(self):
        self.make('video-call.gif')
        self.assertTrue(delivery.check_file('video-call.gif','64×64 gif≥24')[0])
    def test_standalone_still_checks_frames_size_and_loop(self):
        self.make('video-call.gif',loop=1)
        self.assertFalse(delivery.check_file('video-call.gif','64×64 gif≥24')[0])
        self.make('video-call.gif')
        self.assertFalse(delivery.check_file('video-call.gif','64×64 gif≥30')[0])
        self.assertFalse(delivery.check_file('video-call.gif','72×72 gif≥24')[0])
    def test_standalone_rejects_broken_seam(self):
        self.make('video-call.gif',seam=False)
        self.assertFalse(delivery.check_file('video-call.gif','64×64 gif≥24')[0])
    def test_actor_keeps_two_second_rule(self):
        self.make('assets/img/mascot/idle.gif',transparent=True)
        ok,msg=delivery.check_file('assets/img/mascot/idle.gif','64×64 gif≥24')
        self.assertFalse(ok);self.assertIn('2000ms',msg)
    def test_actor_keeps_base_frame_rule(self):
        first=self.make('assets/img/mascot/idle.gif',duration=80,transparent=True)
        ok,msg=delivery.check_file('assets/img/mascot/idle.gif','64×64 gif≥24')
        self.assertFalse(ok);self.assertIn('base-frame.png',msg)
        first.save(Path(self.tmp.name)/'assets/img/mascot/base-frame.png')
        self.assertTrue(delivery.check_file('assets/img/mascot/idle.gif','64×64 gif≥24')[0])

if __name__=='__main__':unittest.main()
