import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({build:{rollupOptions:{input:{index:fileURLToPath(new URL('./index.html',import.meta.url)),cardPack:fileURLToPath(new URL('./card-pack/index.html',import.meta.url)),blindBox:fileURLToPath(new URL('./blind-box/index.html',import.meta.url))}}}});
