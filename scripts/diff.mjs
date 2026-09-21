import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [, , beforeDir, afterDir, ...pages] = process.argv;

for (const spec of pages) {
  const beforePath = `${beforeDir}/${spec}.png`;
  const afterPath = `${afterDir}/${spec}.png`;
  if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) {
    console.log(`${spec}: MISSING FILE`);
    continue;
  }
  const before = PNG.sync.read(fs.readFileSync(beforePath));
  const after = PNG.sync.read(fs.readFileSync(afterPath));
  if (before.width !== after.width || before.height !== after.height) {
    console.log(`${spec}: SIZE MISMATCH before=${before.width}x${before.height} after=${after.width}x${after.height}`);
    continue;
  }
  const { width, height } = before;
  const diffPng = new PNG({ width, height });
  const diffPixels = pixelmatch(before.data, after.data, diffPng.data, width, height, { threshold: 0.1 });
  const pct = (diffPixels / (width * height)) * 100;
  console.log(`${spec}: ${pct.toFixed(3)}% (${diffPixels}/${width * height}px, ${width}x${height})`);
  if (pct > 0.05) {
    fs.writeFileSync(`/tmp/diff_${spec.replace(/[/\\]/g, '_')}.png`, PNG.sync.write(diffPng));
  }
}
