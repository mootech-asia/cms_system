const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const results=[];
  for(const width of [390,1440]){
    const page=await browser.newPage({viewport:{width,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    await page.goto('http://127.0.0.1:8000/event/20261111_lucky_wheel/skins/survival/source/guard-review/',{waitUntil:'networkidle'});
    const images=page.locator('img[data-name]');
    for(const format of ['gif','webp']){
      await page.selectOption('#format',format);await page.waitForFunction(()=>[...document.images].every(im=>im.complete&&im.naturalWidth===400));
      for(let i=0;i<6;i++){
        const image=images.nth(i);const a=await image.screenshot();await page.waitForTimeout(420);const b=await image.screenshot();
        if(a.equals(b))throw Error(`No observed motion: ${width} ${format} ${i}`);
        results.push({width,format,animation:i+1,motion_observed:true});
      }
    }
    await page.click('#pause');await page.waitForFunction(()=>[...document.images].every(im=>im.complete&&im.src.endsWith('base-frame.png')));
    await page.selectOption('#background','light');await page.screenshot({path:path.join(__dirname,`review-light-${width}.png`),fullPage:true});
    await page.selectOption('#background','scene');await page.click('#pause');await page.waitForTimeout(500);
    await page.screenshot({path:path.join(__dirname,`review-stage-${width}.png`),fullPage:true});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    if(overflow||errors.length)throw Error(JSON.stringify({width,overflow,errors}));
    results.push({width,pause_resume:true,background_switch:true,horizontal_overflow:false,errors});
    await page.close();
  }
  await browser.close();fs.writeFileSync(path.join(__dirname,'browser-checks.json'),JSON.stringify(results,null,2));console.log('PASS',results.length,'checks');
})().catch(e=>{console.error(e);process.exit(1)});
