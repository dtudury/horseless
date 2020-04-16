
import { proxy } from '/unpkg/horseless/horseless.js'
export const model = proxy({ v: 0, tics: 1 })

setInterval(() => ++model.tics)
