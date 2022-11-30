import { createApp } from 'vue'
import App from './App.vue'
import pick from './pick'

// const TYPES = [54, 59, 70, 80, 87, 107, 114, 119, 123, 126, 132, 142, 154]
// const MIN_COUNT = 6
// const MAX_COUNT = 6
// const MAX_AREA = 559
// const MAX_AREA_GAP = 1

// const map = pick(TYPES, MIN_COUNT, MAX_COUNT, (one) => {
//   const total = one.reduce((total, o) => total + o, 0)
//   return total >= MAX_AREA - MAX_AREA_GAP && total <= MAX_AREA
// })
// console.log([...map.values()].map(one => `${one.join(',')} ${one.reduce((total, o) => total + o, 0)}`).join('\n'))

const app = createApp(App)
app.mount('#app')


