import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
// Bundles only the Three.js classes used by event/shared/unbox-3d/js/scene.js into one ES module.
export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL('../../event/shared/unbox-3d/vendor', import.meta.url)),
    emptyOutDir: false,
    minify: true,
    lib: {entry: fileURLToPath(new URL('./vendor-entry.js', import.meta.url)), formats: ['es'], fileName: () => 'three.min.js'},
  },
});
