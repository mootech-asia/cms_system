export async function demoRewards({type}) {
  await new Promise(resolve=>setTimeout(resolve,300));
  return (type==='blind-box' ? [{name:'星際旅人',rarity:'SECRET',symbol:'♧'}] : [
    {name:'月光碎片',rarity:'RARE',symbol:'☾'},
    {name:'晨曦之星',rarity:'COMMON',symbol:'✧'},
    {name:'極光之翼',rarity:'SUPER RARE',symbol:'❖'},
  ]);
}
