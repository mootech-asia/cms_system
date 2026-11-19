# Sound sources

Source: user-provided Dropbox `seal_online/sound`, modified 2026-11-18.
Trimmed to interaction duration, short fades, normalized to -20 LUFS / -2 dBTP. Shared Spin hover unchanged. Previous files retained under alternatives/assets/audio/pre-seal-update.

- click.mp3 ← button3009.wav (0.18s)
- move.mp3 ← button3008.wav (0.24s)
- select.mp3 ← BUTTON3003.wav (0.38s)
- flip.mp3 ← button3011.wav (0.25s)
- reveal-common.mp3 ← itemget.wav (0.65s)
- reveal-rare.mp3 ← R_Success.wav (0.95s)
- reveal-epic.mp3 ← level_up.wav (1.25s)
- reveal-legendary.mp3 ← levelup.wav (1.95s)
- reward.mp3 ← R_Success.wav (1.0s)
- collect.mp3 ← itemget.wav (0.6s)
- error.mp3 ← BUTTON3033.wav (0.28s)
- empty.mp3 ← R_Fail.wav (1.4s)
- secret.mp3 ← levelup.wav (2.0s)
- tear.mp3 ← button3022.wav (0.8s)

BGM: seal_online/bgm/13.mp3; full track with 2s tail/head crossfade, -22 LUFS / -2 dBTP. Selection is provisional for in-event listening; timbre has not been directly auditioned in this environment.

Current overrides: tear.mp3 restored byte-for-byte from pre-seal-update; all four prize reveals use the uploaded button3026.wav unchanged as reveal-3026.wav. BUTTON3018.wav is not applied. Previous reveal clips are retained under alternatives/assets/audio/pre-user-reveal.

BGM override: user-uploaded 13.mp3 is copied byte-for-byte to assets/audio/bgm.mp3; existing volume, ducking and looping controls remain. Previously processed BGM is archived under alternatives/assets/audio/pre-uploaded-bgm/.

2026-11-19 rarity refresh: tear.wav uses Dropbox seal_online/sound/BUTTON3017.wav unchanged (single continuous envelope). Common/Rare use itemget.wav unchanged as reveal-basic.wav; Epic/Legendary retain their existing clips. Old runtime files moved to alternatives/assets/audio/pre-rarity-refresh. Candidate timbre still requires user listening; waveform structure and playback timing were checked.

Current BGM: user-uploaded 13671650.wav copied byte-for-byte as assets/audio/bgm.wav; 13.mp3 archived under alternatives/assets/audio/pre-rarity-refresh/bgm.mp3.

Rejected opening selection: BUTTON3017.wav moved to alternatives/assets/audio/rejected-opening/. Active tear.mp3 restored byte-for-byte from pre-rarity-refresh; tear timing restored to 800ms. Configured effects now wait for their source instead of substituting synthesis; opening waits for its audio before animation.

Previous tear (archived under pre-music-separation): 0.54-second extract from the supplied 15-23-02 recording (0.595–1.135 seconds). The extract uses a 220 Hz high-pass, the recording's pre-tear noise profile, and short fades. It is stored as PCM WAV. The unfiltered AAC extract is archived in pre-isolated-tear and the original recording remains in source/audio. The card-pack BGM is silent while tearing and returns to its reveal level when the prize screen appears.

Active tear: 0.385-second PCM mono render of the matching tear across the two supplied recordings. The two takes were aligned by 16,939 samples at 44.1 kHz, then combined using a time-frequency coherence mask to reject nonmatching background sounds. Only the 0.740–1.125 second tear region of the 15-23-02 timeline is retained.
