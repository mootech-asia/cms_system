# Empty outcome support

Both default prize pools include an explicit `type: 'empty'` entry, weight 15 (relative mock weight, not production probability). Existing prize indices remain unchanged. Backend responses can return its index or a named empty object; an empty response array is still an error.

Empty outcomes consume one chance and appear in history. Results have translated no-prize labels, no reward icon/stars, Continue instead of Collect, and a separate gentle cue. Empty indexed winners are excluded from the ticker. The genie reacts with its existing encourage animation after closing an empty result; any real prize, including common, triggers celebration. Multi-item outcomes celebrate if any item is a prize.

Validation: `scripts/verify-unbox-empty.cjs` passed both events × en/ko/th at 390×844, result text, continue, no fallback gem, chance consumption, history and genie lose state; common prize Collect/celebrate passed separately. Screenshots included. `npm run build` passed. Real device audio, production backend and multi-item visual flow not verified.

Audio candidates: 25 files from the user-provided Dropbox seal_online/sound folder. No existing effect or music was replaced. Preview copies in docs/audio-audition/seal-online normalize loudness to -20 LUFS / -2 dBTP and encode MP3. Candidates are selected by filename category, not a claim of listening-based approval. User direction: refined magic, crisp, short, layered. Source modification date: 2026-11-18.
