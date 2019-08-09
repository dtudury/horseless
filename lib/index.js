import { decodeDescriptions } from './horsyDecoders.js'
export { watchSetChildren, getNode } from './nodeCreators.js'
export { watch, unwatch, watchFunction, unwatchFunction, modelify } from './functionWatcher.js'
export { setChildren } from './nodeCreators.js'
export { FRAGMENT } from './fragment.js'

export function h (strings, ...values) {
  const ss = [strings[0].split('')]
  for (let i = 0; i < values.length; i++) {
    ss.push({ value: values[i], isValue: true })
    ss.push(strings[i + 1].split(''))
  }
  const arr = [].concat.apply([], ss)
  arr.i = 0
  return decodeDescriptions(arr)
}
