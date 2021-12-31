/* global requestAnimationFrame */
const _proxySet = new Set()
const _keyMaps = new Map()
const _triggerable = new Set()
const _triggered = new Set()
const _stack = []
const _afterTriggered = []
const _OWN_KEYS = Symbol('ownKeys as attribute')
let _handlingTriggered = false

function _reportKeyMutation (target, key) {
  if (_keyMaps.has(key)) {
    const keyMap = _keyMaps.get(key)
    if (keyMap.has(target)) {
      if (!_handlingTriggered) {
        _handlingTriggered = true
        requestAnimationFrame(() => {
          _handlingTriggered = false
          for (const callback of _triggered) {
            callback()
          }
          _triggered.clear()
          while (_afterTriggered.length) {
            _afterTriggered.shift()()
          }
        })
      }
      for (const callback of keyMap.get(target)) {
        _triggered.add(callback)
      }
      keyMap.delete(target)
      if (!keyMap.size) {
        _keyMaps.delete(key)
      }
    }
  }
}

function _reportKeyAccess (target, key) {
  if (_stack.length) {
    if (!_keyMaps.has(key)) {
      _keyMaps.set(key, new Map())
    }
    const keyMap = _keyMaps.get(key)
    if (!keyMap.has(target)) {
      keyMap.set(target, new Set())
    }
    keyMap.get(target).add(_stack[0])
  }
}

export function proxy (target = {}) {
  const isArray = Array.isArray(target)
  const isObject = target && target.constructor === Object
  if ((isArray || isObject) && !_proxySet.has(target)) {
    const _self = new Proxy(isArray ? new Array(target.length) : {}, {
      has (target, key) {
        _reportKeyAccess(target, key)
        return key in target
      },
      get (target, key) {
        _reportKeyAccess(target, key)
        return target[key]
      },
      set (target, key, value) {
        value = proxy(value)
        if (target[key] !== value || key === 'length') { // array length is magical
          if (!(key in target)) {
            _reportKeyMutation(target, _OWN_KEYS)
          }
          _reportKeyMutation(target, key)
        }
        target[key] = value
        return true
      },
      deleteProperty (target, key) {
        if (key in target) {
          _reportKeyMutation(target, _OWN_KEYS)
          _reportKeyMutation(target, key)
        }
        return Reflect.deleteProperty(target, key)
      },
      ownKeys (target) {
        _reportKeyAccess(target, _OWN_KEYS)
        return Reflect.ownKeys(target)
      }
    })
    Object.assign(_self, target)
    _proxySet.add(_self)
    target = _self
  }
  return target
}

export function watchFunction (f) {
  function wrapped () {
    if (_triggerable.has(f)) {
      _stack.unshift(wrapped)
      f()
      _stack.shift()
    }
  }
  if (!_triggerable.has(f)) {
    _triggerable.add(f)
    wrapped()
  }
}

export function unwatchFunction (f) {
  _triggerable.delete(f)
}

export function after (f) {
  _afterTriggered.push(f)
}