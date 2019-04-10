/* global requestAnimationFrame */

const _modelMap = new Map()
const _callbackSetMapMap = new Map()
const _liveCallbackSetMap = new Map()
const _nextCallbacksSet = new Set()
let _waiting = false

let gets = []

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
  const proxy = new Proxy(target, {
    set (target, property, value, proxy) {
      if (target[property] !== value) {
        if (value instanceof Object) {
          value = model(value)
          if (!_liveCallbackSetMap.has(value)) {
            _liveCallbackSetMap.set(value, new Set())
          }
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
        if (_liveCallbackSetMap.has(proxy)) {
          _liveCallbackSetMap.get(proxy).forEach(callback => callback())
        }
      }
      return true
    },
    get (target, property, proxy) {
      gets.push([proxy, property])
      return target[property]
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

class ObservableValue {
  constructor (calculator) {
    this._observers = new Set()
    this._update = () => {
      this.value = calculator()
      this._observers.forEach(observer => observer(this.value))
    }
    this._update()
  }
  observe (observer) {
    this._observers.add(observer)
    observer(this.value)
  }
}

let m = model()
observe(m, () => console.log('m changed'))
m.a = 1
m.a = 2
m.b = 2
m.c = {}
observe(m.c, () => console.log('m.c.e has changed'), 'e')
observe(m.c, () => console.log('m.c.d has changed'), 'd')
observe(m.c, () => console.log('m.c has changed'))
m.c.d = 1
console.log(m)

gets = []
let o = m.c.d + m.a
console.log(gets)
gets.forEach(([proxy, property]) => {
  if (proxy.hasOwnProperty(property)) {
    console.log(property, proxy[property])
  }
})
console.log(o)

exports.model = model
exports.observe = observe
exports.ObservableValue = ObservableValue
