import { decodeDescriptions } from './horsyDecoders.js'
export { render } from './nodeCreators.js'
export { watch, unwatch, watchFunction, unwatchFunction, remodel } from './functionWatcher.js'
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
