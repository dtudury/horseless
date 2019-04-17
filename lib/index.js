/* global Node */
import { readChildren } from './horsyDecoders'
import { setChildrenFromDescriptions, flattenArray } from './nodeCreators'

export { setAttributes, setChildren } from './nodeCreators'

export const FRAGMENT = Symbol('fragment')

export function readDescriptions (strings, ...values) {
  const ss = [strings[0].split('')]
  for (let i = 0; i < values.length; i++) {
    ss.push({ value: values[i], isValue: true })
    ss.push(strings[i + 1].split(''))
  }
  const arr = flattenArray(ss)// [].concat.apply([], ss)
  arr.i = 0
  return readChildren(arr)
}

export function h (element, ...values) {
  if (element instanceof Node) {
    return function (strings, ...values) {
      return setChildrenFromDescriptions(element, readDescriptions(strings, ...values))
    }
  }
  const strings = element
  return readDescriptions(strings, ...values)
}
