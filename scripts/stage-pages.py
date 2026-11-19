"""Stage tracked site files, retaining event originals in Git but not in Pages."""
from pathlib import Path
import subprocess,shutil,sys,json
root=Path(__file__).resolve().parent.parent;dest=Path(sys.argv[1]).resolve()
if dest==root or root.is_relative_to(dest):raise SystemExit('Destination must be separate from repository root')
kept=excluded=0;count=0
for raw in subprocess.check_output(['git','ls-files','-z'],cwd=root).split(b'\0'):
 if not raw:continue
 rel=Path(raw.decode());p=root/rel
 if not p.is_file():continue
 size=p.stat().st_size
 if len(rel.parts)>2 and rel.parts[0]=='event' and any(part in {'source','alternatives','tools'} for part in rel.parts[2:-1]):
  excluded+=size;continue
 target=dest/rel;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target);kept+=size;count+=1
print(json.dumps({'files':count,'stagedBytes':kept,'excludedEventOriginalBytes':excluded}))
