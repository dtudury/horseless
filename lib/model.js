/* global requestAnimationFrame */

const _modelMap = new Map()
const _callbackSetMapMap = new Map()
const _deepCallbackSetMap = new Map()
const _nextCallbacksSet = new Set()
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

function model (target = {}) {
  if (_modelMap.has(target)) {
    return _modelMap.get(target)
  }
  function deepCallback () {

  }
  const proxy = new Proxy(target, {
    set (target, property, value, proxy) {
      if (target[property] !== value) {
        if (_deepCallbackSetMap.has(target[property])) {
          _deepCallbackSetMap.get(target[property]).delete(deepCallback)
        }
        if (value instanceof Object) {
          value = model(value)
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
        if (_deepCallbackSetMap.has(proxy)) {
          _handleChange(_deepCallbackSetMap.get(proxy))
        }
      }
      return true
    }
  })
  _modelMap.set(target, proxy)
  _modelMap.set(proxy, proxy)
  return proxy
}

function observe (target, callback, key) {
  target = model(target)
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

function deepObserve (target, callback) {
  target = model(target)
  if (!_deepCallbackSetMap.has(target)) {
    _deepCallbackSetMap.set(target, new Set())
  }
  const deepCallbackSet = _deepCallbackSetMap.get(target)
  deepCallbackSet.add(callback)
}

let m = model()
observe(m, () => console.log('m changed'))
deepObserve(m, () => console.log('m has changed deeply'))
m.a = 1
m.a = 2
m.b = 2
console.log(m)
