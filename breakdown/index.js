import { h } from './unpkg/horseless.decoder/index.js'
import { proxy, watchFunction, unwatchFunction } from './unpkg/horseless.remodel/index.js'
import { render } from './nodeCreator.js'

console.log(h`test`)

export { render, h, proxy, watchFunction, unwatchFunction }
