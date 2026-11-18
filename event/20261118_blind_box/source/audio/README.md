# 原創活動配樂

以 `scripts/compose-event-bgm.py` 產生，旋律與編曲由程式定義，未引用外部歌曲。

沙漠：96 BPM、D Hijaz 色彩與明亮對比段、24 小節、60 秒；尼龍撥弦、揚琴、長笛與輕打擊。

保留可編輯音符 JSON 與 48 kHz / 24-bit WAV；交付 44.1 kHz / 128 kbps MP3。渲染前一循環保留殘響，輸出完整小節。量測見 loudness.json；音樂於第一次操作後載入，開獎降低音量。

音源：TimGM6mb.sf2，Tim Brechbill (2004)、David Bolton (2010)，GPL-2。使用系統音源渲染，未將 soundfont 隨網站散布。音源授權文字保留於 soundfont-copyright.txt。
