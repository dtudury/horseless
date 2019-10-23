import { decodeDescriptions } from './horsyDecoders.js'

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

export function showIf (condition, a, b = () => []) {
  const _a = a()
  const _b = b()
  return () => {
    return condition() ? _a : _b
  }
}

const _defaultMap = new Map()
export function mapList (list, f, map = _defaultMap) {
  return () => {
    return list().map(todo => {
      if (!map.has(todo)) {
        map.set(todo, f(todo))
      }
      return map.get(todo)
    })
  }
}
