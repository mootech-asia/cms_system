// Preview persistence is separate from the refillable chance/record data.
export function createSecretCycle(key, limit = 50, storage = null, random = Math.random, initialTotal = 0) {
  if (!storage) { try { storage = window.localStorage; } catch (_) {} }
  const nextGap = () => 1 + Math.min(limit-1, Math.floor(Math.max(0,random())*limit));
  let value;
  try { value = JSON.parse(storage.getItem(key)); } catch (_) {}
  if (!value || !Number.isSafeInteger(value.total) || value.total < 0 || !Number.isSafeInteger(value.nextAt) || value.nextAt <= value.total || value.nextAt > value.total+limit) {
    value = { total:initialTotal, nextAt:initialTotal+nextGap(), notifiedAt:0 };
  }
  const save = () => { try { storage.setItem(key,JSON.stringify(value)); } catch (_) {} };
  save();
  return {
    due: () => value.total+1 === value.nextAt,
    total: () => value.total,
    needsNotice: () => value.total+1 === value.nextAt && value.notifiedAt !== value.nextAt,
    notified: () => { value.notifiedAt=value.nextAt; save(); },
    commit: () => {
      const secret = value.total+1 === value.nextAt;
      value.total++;
      if (secret) value.nextAt=value.total+nextGap();
      save();
      return { edition:secret?'secret':'standard', drawNumber:value.total };
    }
  };
}
