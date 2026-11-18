"""Render two original event scores with FluidSynth; preserve editable note events and masters."""
import ctypes as C
import ctypes.util
import json
import math
from pathlib import Path
import subprocess
import tempfile
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RATE = 48000
FONT = '/usr/share/sounds/sf2/TimGM6mb.sf2'
lib = C.CDLL(ctypes.util.find_library('fluidsynth'))
def api(name, args, result=C.c_int):
    fn = getattr(lib, name); fn.argtypes=args; fn.restype=result; return fn
ptr=C.c_void_p; integer=C.c_int; string=C.c_char_p
settings_new=api('new_fluid_settings',[],ptr)
setting_num=api('fluid_settings_setnum',[ptr,string,C.c_double])
setting_int=api('fluid_settings_setint',[ptr,string,integer])
synth_new=api('new_fluid_synth',[ptr],ptr)
sfload=api('fluid_synth_sfload',[ptr,string,integer])
program=api('fluid_synth_program_change',[ptr,integer,integer])
cc=api('fluid_synth_cc',[ptr,integer,integer,integer])
on=api('fluid_synth_noteon',[ptr,integer,integer,integer]);off=api('fluid_synth_noteoff',[ptr,integer,integer])
write=api('fluid_synth_write_float',[ptr,integer,ptr,integer,integer,ptr,integer,integer])
delete=api('delete_fluid_synth',[ptr],None); delete_settings=api('delete_fluid_settings',[ptr],None)


def score(desert):
    bpm=96 if desert else 100; bars=24 if desert else 32
    notes=[]
    def note(ch,pitch,start,length,velocity):
        notes.append(dict(channel=ch,pitch=int(pitch),beat=round(start,4),duration=round(length,4),velocity=int(velocity)))
    for bar in range(bars):
        t=bar*4; section=bar//8; bright=section==1
        if desert:
            chords=([50,54,57],[43,46,50],[51,55,58],[48,51,55]) if not bright else ([50,54,57],[47,50,54],[43,47,50],[45,49,52])
            chord=chords[bar%4]
            for pitch in chord:note(3,pitch,t,3.85,30 if bright else 24)
            note(4,chord[0]-12,t,1.7,42);note(4,chord[0]-12,t+2,1.4,32)
            # Staggered plucks leave room for the short lead phrases.
            for step in range(8):note(0,chord[(step+bar)%3]+12,t+step*.5,.42,46+(step%3)*4)
            lead=([74,69,75,78],[79,78,75,74],[77,79,82,79],[75,72,74,69]) if not bright else ([74,78,81,83],[81,78,76,74],[79,83,81,78],[76,73,76,81])
            for j,(beat,dur) in enumerate([(0,.85),(1.25,.55),(2,.65),(3,1.0)]):note(2 if bar%4 in [1,3] else 0,lead[bar%4][j],t+beat,dur,47 if bright else 40)
            if bright or bar%4==3:
                for j in range(6):note(1,chord[j%3]+24,t+2.5+j*.25,.6,27+j%2*5)
            for beat,key,vel in [(0,64,48),(1,60,32),(2,64,39),(2.5,60,26),(3.5,60,34)]:note(9,key,t+beat,.12,vel)
            for beat in [.5,1.5,2.5,3.5]:note(9,54,t+beat,.12,16 if not bright else 23)
        else:
            chords=([53,57,60,64],[48,52,55,59],[50,53,57,60],[46,50,53,57]);chord=chords[bar%4]
            for pitch in chord:note(0,pitch-12,t,4.1,28 if not bright else 33)
            for pitch in chord[:3]:note(3,pitch,t+.08,2.8,32)
            note(4,chord[0]-24,t,1.8,40);note(4,chord[0]-12,t+2.5,.85,27)
            for j in range(8):note(2,chord[[0,2,1,3,2,1,3,2][j]]+12,t+j*.5,.85,22+(j%3)*4)
            motifs=([77,81,84,83],[79,76,74,72],[77,76,81,79],[77,74,72,69])
            if section!=3 or bar%2==0:
                for j,(beat,dur) in enumerate([(0,.85),(1.25,.55),(2,1.1),(3.5,.7)]):note(1,motifs[bar%4][j],t+beat,dur,44 if bright else 35)
            if bright and bar%2:
                for j in range(8):note(2,chord[j%4]+24,t+2+j*.25,.5,21)
            for beat,key,vel in [(0,36,35),(2,36,28),(1.5,37,22),(3.5,37,24)]:note(9,key,t+beat,.1,vel)
            if section in [1,2]:
                for beat in [.5,1.5,2.5,3.5]:note(9,42,t+beat,.08,14)
    return dict(bpm=bpm,bars=bars,beats=bars*4,programs=([24,15,73,48,32] if desert else [89,8,46,4,33]),notes=notes)


def render(name,desert):
    data=score(desert); seconds=data['beats']*60/data['bpm']; length=round(seconds*RATE)
    settings=settings_new();setting_num(settings,b'synth.sample-rate',RATE);setting_num(settings,b'synth.gain',.6);setting_int(settings,b'synth.chorus.active',0)
    setting_num(settings,b'synth.reverb.room-size',.65);setting_num(settings,b'synth.reverb.damp',.45);setting_num(settings,b'synth.reverb.level',.22)
    synth=synth_new(settings);assert sfload(synth,FONT.encode(),1)>=0
    for ch,prg in enumerate(data['programs']):program(synth,ch,prg);cc(synth,ch,10,[58,72,46,64,64][ch]);cc(synth,ch,91,44)
    cc(synth,9,91,18)
    events=[]
    # Render the preceding loop as well, so reverb tails are present at the start.
    for loop in range(2):
        for n in data['notes']:
            start=round(n['beat']*60/data['bpm']*RATE)+loop*length
            end=start+round(n['duration']*60/data['bpm']*RATE)
            events.extend([(start,1,n),(end,0,n)])
    events.sort(key=lambda e:(e[0],e[1])); left=np.zeros(length*2,np.float32);right=np.zeros_like(left);position=0
    def audio_until(end):
        nonlocal position
        end=min(end,len(left))
        while position<end:
            count=min(8192,end-position)
            write(synth,count,ptr(left.ctypes.data+position*4),0,1,ptr(right.ctypes.data+position*4),0,1);position+=count
    for at,kind,n in events:
        if at>=length*2:break
        audio_until(at)
        if kind:on(synth,n['channel'],n['pitch'],n['velocity'])
        else:off(synth,n['channel'],n['pitch'])
    audio_until(length*2);delete(synth);delete_settings(settings)
    mix=np.column_stack((left[length:],right[length:]))
    root=ROOT/f'event/20261118_{name}';source=root/'source/audio';source.mkdir(parents=True,exist_ok=True)
    data.update(durationSeconds=seconds,sampleRate=RATE,soundfont='TimGM6mb.sf2; Tim Brechbill / David Bolton, GPL-2',loop='Exact full-bar cycle; previous cycle rendered to retain reverb tails')
    (source/'bgm-score.json').write_text(json.dumps(data,indent=2))
    with tempfile.TemporaryDirectory() as tmp:
        raw=Path(tmp)/'mix.f32';mix.tofile(raw)
        args=['ffmpeg','-hide_banner','-y','-f','f32le','-ar',str(RATE),'-ac','2','-i',str(raw)]
        measured=subprocess.run(args+['-af','loudnorm=I=-20:TP=-1:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
        stats=json.JSONDecoder().raw_decode(measured[measured.rfind('{'):])[0]
        norm=f"loudnorm=I=-20:TP=-1:LRA=8:measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true"
        master=source/'bgm.wav'
        subprocess.run(args+['-af',norm,'-ar','48000','-c:a','pcm_s24le',str(master)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(master),'-ar','44100','-c:a','libmp3lame','-b:a','128k',str(root/'assets/audio/bgm.mp3')],check=True)
    print(name,seconds,'seconds', (root/'assets/audio/bgm.mp3').stat().st_size,'bytes',flush=True)

if __name__=='__main__':
    render('card_pack',False)
    render('blind_box',True)
