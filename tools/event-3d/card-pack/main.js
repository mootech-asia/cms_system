import { createEvent } from '../shared/event.js';
import { demoRewards } from '../shared/demo.js';
export const event = createEvent(document.querySelector('#app'), {
  type: 'card-pack',
  coverUrl: null,
  resolveRewards: demoRewards,
});
if (import.meta.hot) import.meta.hot.dispose(() => event.destroy());
