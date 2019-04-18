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

function modelify (target = {}) {
  if (_modelMap.has(target)) {
    return _modelMap.get(target)
  }
  const proxy = new Proxy(target, {
    set (target, property, value, proxy) {
      if (value instanceof Object) {
        value = modelify(value)
      }
      target[property] = value
      if (_callbackSetMapMap.has(proxy)) {
        const callbackSetMap = _callbackSetMapMap.get(proxy)
        if (callbackSetMap.has(property)) {
          _handleChange(callbackSetMap.get(property))
        }
        if (callbackSetMap.has()) {
          _handleChange(callbackSetMap.get())
        }
      }
      return true
    },
    get (target, property, proxy) {
      if (_gets[0]) {
        _gets[0].push([proxy, property])
      }
      return target[property]
    }
  })

  Object.keys(target).forEach(property => {
    if (target[property] instanceof Object) {
      target[property] = modelify(target[property])
    }
  })

  _modelMap.set(target, proxy)
  _modelMap.set(proxy, proxy)
  return proxy
}

function _watch (target, callback, key) {
  target = modelify(target)
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

function _unwatch (target, callback, key) {
  target = modelify(target)
  if (_callbackSetMapMap.has(target)) {
    const callbackSetMap = _callbackSetMapMap.get(target)
    if (callbackSetMap.has(key)) {
      const callbackSet = callbackSetMap.get(key)
      callbackSet.delete(callback)
    }
  }
}

function watchFunction (f, callback) {
  function routeFunction () {
    o.getStack.forEach(([proxy, property]) => _unwatch(proxy, routeFunction, property))
    _gets.unshift([])
    const v = f()
    o.getStack = _gets.shift()
    o.getStack.forEach(([proxy, property]) => _watch(proxy, routeFunction, property))
    if (callback) {
      callback(v)
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
    return o.getStack
  }
  return null
}

function unwatchFunction (f, callback) {
  if (_watchFunctions.has(f)) {
    const functionCallbackMap = _watchFunctions.get(f)
    if (functionCallbackMap.has(callback)) {
      const o = functionCallbackMap.get(callback)
      o.getStack.forEach(([proxy, property]) => _unwatch(proxy, o.routeFunction, property))
      functionCallbackMap.delete(callback)
      return true
    }
  }
  return false
}

exports.modelify = modelify
exports.watchFunction = watchFunction
exports.unwatchFunction = unwatchFunction
