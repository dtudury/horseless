/* global requestAnimationFrame */

const _modelMap = new Map()
const _callbackSetMapMap = new Map()
const _nextCallbacksSet = new Set()
const _watchFunctions = new Map()
const _gets = []
let _waiting = false

function _handleChange (callbackSet) {
  if (!_waiting) {
    _waiting = true
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(_dispatch)
    } else {
      setTimeout(_dispatch)
    }
  }
  callbackSet.forEach(v => _nextCallbacksSet.add(v))
}

function _dispatch () {
  [..._nextCallbacksSet].forEach(callback => callback())
  _waiting = false
  _nextCallbacksSet.clear()
}

export function remodel (target = {}) {
  function bumpCallbacks (proxy, property) {
    if (_callbackSetMapMap.has(proxy)) {
      const callbackSetMap = _callbackSetMapMap.get(proxy)
      if (callbackSetMap.has(property)) {
        _handleChange(callbackSetMap.get(property))
      }
      if (callbackSetMap.has()) {
        _handleChange(callbackSetMap.get())
      }
    }
  }
  if (!_modelMap.has(target)) {
    const traps = {
      set (target, property, value, proxy) {
        if (value instanceof Object) {
          value = remodel(value)
        }
        target[property] = value
        bumpCallbacks(proxy, property)
        return true
      },
      deleteProperty (target, property) {
        const value = Reflect.deleteProperty(target, property)
        bumpCallbacks(proxy, property)
        return value
      },
      get (target, property, proxy) {
        if (_gets[0]) {
          _gets[0].push([proxy, property])
        }
        return target[property]
      },
      ownKeys (target, handler) {
        if (_gets[0]) {
          _gets[0].push([proxy])
        }
        return Reflect.ownKeys(target)
      }
    }
    const proxy = new Proxy(target, traps)
    Object.keys(target).forEach(property => {
      if (target[property] instanceof Object) {
        target[property] = remodel(target[property])
      }
    })
    _modelMap.set(target, proxy)
    _modelMap.set(proxy, proxy)
  }
  return _modelMap.get(target)
}

export function watch (target, callback, key) {
  target = remodel(target)
  if (!_callbackSetMapMap.has(target)) {
    _callbackSetMapMap.set(target, new Map())
  }
  const callbackSetMap = _callbackSetMapMap.get(target)
  if (!callbackSetMap.has(key)) {
    callbackSetMap.set(key, new Set())
  }
  const callbackSet = callbackSetMap.get(key)
  callbackSet.add(callback)
}

export function unwatch (target, callback, key) {
  target = remodel(target)
  if (_callbackSetMapMap.has(target)) {
    const callbackSetMap = _callbackSetMapMap.get(target)
    if (callbackSetMap.has(key)) {
      const callbackSet = callbackSetMap.get(key)
      callbackSet.delete(callback)
    }
  }
}

export function watchFunction (f, callback) {
  function routeFunction () {
    o.getStack.forEach(([proxy, property]) => unwatch(proxy, routeFunction, property))
    _gets.unshift([])
    const v = f(o)
    o.prev = v
    o.getStack = _gets.shift()
    o.getStack.forEach(([proxy, property]) => watch(proxy, routeFunction, property))
    if (o.callback) {
      o.callback(v)
    }
  }
  const o = { getStack: [], routeFunction }
  if (!_watchFunctions.has(f)) {
    _watchFunctions.set(f, new Map())
  }
  const functionCallbackMap = _watchFunctions.get(f)
  if (!functionCallbackMap.has(callback)) {
    functionCallbackMap.set(callback, o)
    routeFunction()
    return o
  }
  return null
}

export function unwatchFunction (f, callback) {
  if (_watchFunctions.has(f)) {
    const functionCallbackMap = _watchFunctions.get(f)
    if (functionCallbackMap.has(callback)) {
      const o = functionCallbackMap.get(callback)
      o.getStack.forEach(([proxy, property]) => unwatch(proxy, o.routeFunction, property))
      functionCallbackMap.delete(callback)
      return true
    }
  }
  return false
}
