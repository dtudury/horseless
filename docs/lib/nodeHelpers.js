import { decodeDescriptions } from './horsyDecoders.js'

export function h (strings, ...values) {
  let xmlns
  function _h (strings, ...values) {
    const ss = [strings[0].split('')]
    for (let i = 0; i < values.length; i++) {
      ss.push({ value: values[i], isValue: true })
      ss.push(strings[i + 1].split(''))
    }
    const arr = [].concat.apply([], ss)
    arr.i = 0
    return decodeDescriptions(arr, null, xmlns)
  }
  if (Array.isArray(strings)) {
    return _h(strings, ...values)
  } else if (typeof strings === 'string' || strings == null) {
    xmlns = strings
    return _h
  }
}

export function showIf (condition, a, b = () => []) {
  const _a = a()
  const _b = b()
  return () => {
    return condition() ? _a : _b
  }
}

export function mapList (list, f, map = new Map()) {
  return () => {
    return list().map(value => {
      if (!map.has(value)) {
        map.set(value, f(value))
      }
      return map.get(value)
    })
  }
}

export function mapObject (obj, f, map = new Map()) {
  return () => {
    const _obj = obj()
    if (!map.has(_obj)) {
      map.set(_obj, new Map())
    }
    const _map = map.get(_obj)
    return Object.keys(_obj).map(name => {
      const value = _obj[name]
      if (!_map.has(name)) {
        _map.set(name, f(value, name))
      }
      return _map.get(name)
    })
  }
}
