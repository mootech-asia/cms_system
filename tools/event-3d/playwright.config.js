import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:'http://localhost:5173',launchOptions:{args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},webServer:{command:'npm run dev',url:'http://localhost:5173',reuseExistingServer:true}});
