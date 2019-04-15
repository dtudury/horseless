import { readChildren } from './horsyDecoders'
import { createNodes, setChildrenFromDescriptions } from './nodeCreators'

export { setAttributes, setChildren } from './nodeCreators'

export const FRAGMENT = Symbol('fragment')

export function readDescriptions (strings, ...values) {
  const ss = [strings[0].split('')]
  for (let i = 0; i < values.length; i++) {
    ss.push({ value: values[i], isValue: true })
    ss.push(strings[i + 1].split(''))
  }
  const arr = [].concat.apply([], ss)
  arr.i = 0
  return readChildren(arr)
}

export default function horsy (strings, ...values) {
  return createNodes(readDescriptions(strings, ...values))
}

export function h2 (element) {
  return function (strings, ...values) {
    return setChildrenFromDescriptions(element, readDescriptions(strings, ...values))
  }
}
