import numpy as np,wave,json
from pathlib import Path
from scipy.signal import butter,sosfilt
base=Path(__file__).resolve().parents[2];sr=44100;rng=np.random.default_rng(518)
def write(name,x):
 x=np.tanh(x);x=x/max(np.max(np.abs(x)),.001)*.72
 with wave.open(str(base/f'source/audio/{name}.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((x*32767).astype('<i2').tobytes())
 return {'duration':len(x)/sr,'peak':float(np.max(np.abs(x))),'rms':float(np.sqrt(np.mean(x*x)))}
t=np.arange(int(sr*1.7))/sr;n=rng.normal(0,1,len(t));grain=sosfilt(butter(2,[1300,11000],btype='bandpass',fs=sr,output='sos'),n);env=np.zeros(len(t))
for center,amp,width in [(.035,1,.017),(.12,.7,.035),(.24,.65,.055),(.38,.8,.06),(.52,.75,.055),(.68,.9,.07),(.83,.7,.07),(.99,.8,.055),(1.12,.9,.025),(1.26,.4,.045),(1.4,.25,.04)]:env+=amp*np.exp(-((t-center)/width)**2)
flutter=.45+.55*np.abs(np.sin(2*np.pi*(38*t+13*t*t)));x=grain*env*flutter*.7
for pos in rng.uniform(.1,1.13,95):
 start=int(pos*sr);duration=int(sr*rng.uniform(.001,.004));x[start:start+duration]+=rng.normal(0,.3,duration)*np.exp(-np.arange(duration)/(duration*.23))
x*=np.minimum(1,t/.005)*np.clip((1.7-t)/.12,0,1);a=write('foil-tear',x)
t=np.arange(int(sr*2.5))/sr;x=np.zeros(len(t))
for freq,start,amp,decay in [(196,0,.26,1),(392,.03,.12,.7),(784,.12,.2,.8),(987.77,.3,.16,.85),(1174.66,.48,.15,.8),(1568,.66,.14,.7)]:
 dt=t-start;gate=(dt>=0);z=np.maximum(dt,0);env=(1-np.exp(-z/.009))*np.exp(-z/decay)*gate
 for ratio,gain in [(1,1),(2.01,.22),(3.98,.08)]:x+=np.sin(2*np.pi*freq*ratio*z)*env*amp*gain
for delay,gain in [(.11,.15),(.23,.11),(.37,.07)]:k=int(sr*delay);x[k:]+=x[:-k].copy()*gain
x*=np.clip((2.5-t)/.35,0,1);b=write('secret',x)
(base/'source/audio/new-cues.json').write_text(json.dumps({'foil-tear':a,'secret':b},indent=2))
