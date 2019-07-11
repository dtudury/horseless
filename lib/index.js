import { decodeDescriptions } from './horsyDecoders'
export { watchSetChildren } from './nodeCreators'
export { watchFunction, unwatchFunction, modelify } from './functionWatcher'
export { setChildren } from './nodeCreators'
export { FRAGMENT } from './fragment'

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
