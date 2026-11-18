import {test,expect} from '@playwright/test';
for (const type of ['card-pack','blind-box']) {
 test(`${type}: select, open once, reveal, restart`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/${type}/`);
  await expect(page.locator('canvas')).toBeVisible();
  await page.getByRole('button',{name:'下一個',exact:true}).click();
  await expect(page.locator('[data-selection]')).toContainText('02');
  await page.locator('[data-action]').click();
  await page.locator('[data-action]').dblclick();
  await expect(page.locator('[data-skip]')).toBeVisible();
  await page.locator('[data-skip]').click();
  const count=type==='card-pack'?3:1;
  for(let i=0;i<count;i++)await page.locator('[data-action]').click();
  await expect(page.locator('.reward')).toHaveCount(count);
  await page.locator('[data-reset]').click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.reward')).toHaveCount(0);
  expect(errors).toEqual([]);
 });
}
test('mobile layout',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/card-pack/');
 await expect(page.locator('canvas')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.screenshot({path:'preview-mobile.png'});
});
