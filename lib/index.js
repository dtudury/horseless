import { decodeDescriptions } from './horsyDecoders'
export { watchSetChildren } from './nodeCreators'

export { setAttributes, setChildren } from './nodeCreators'

export const FRAGMENT = Symbol('fragment')

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
