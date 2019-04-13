
import { modelify } from '../../lib/functionWatcher'
export default modelify({ todos: [] })

/*
export default class Model {
  constructor () {
    this._waiting = false
    this._touches = new Map()
    this._targetWatchers = new Map()
    this._allWatchers = new Set()
  }
  watchify (target = {}) {
    const model = this
    const proxy = new Proxy(target, {
      set (target, key, value, proxy) {
        if (target[key] !== value) {
          target[key] = value
          model._handleChange(proxy, key)
        }
        return true
      }
    })
    return proxy
  }
  watch (target, watcher, key) {
    if (!this._targetWatchers.has(target)) {
      this._targetWatchers.set(target, new Map())
    }
    const targetWatcher = this._targetWatchers.get(target)
    if (!targetWatcher.has(key)) {
      targetWatcher.set(key, new Set())
    }
    targetWatcher.get(key).add(watcher)
  }
  unwatch (target, watcher, key) {
    if (this._targetWatchers.has(target)) {
      const targetWatcher = this._targetWatchers.get(target)
      if (targetWatcher.has(key)) {
        targetWatcher.get(key).delete(watcher)
      }
    }
  }
  watchAll (watcher) {
    this._allWatchers.add(watcher)
  }
  unwatchAll (watcher) {
    this._allWatchers.delete(watcher)
  }
  _handleChange (proxy, key) {
    if (!this._waiting) {
      requestAnimationFrame(() => this._dispatch())
      this._waiting = true
    }
    if (!this._touches.has(proxy)) {
      this._touches.set(proxy, new Set())
    }
    const touchedKeys = this._touches.get(proxy)
    touchedKeys.add(key)
    touchedKeys.add()
  }
  _dispatch () {
    this._waiting = false
    if (!this._touches.size) {
      return
    }
    let watchers = [...this._allWatchers]
    this._touches.forEach((touchedKeys, proxy) => {
      const targetWatcher = this._targetWatchers.get(proxy)
      if (targetWatcher) {
        touchedKeys.forEach(key => {
          if (targetWatcher.has(key)) {
            watchers = watchers.concat(...targetWatcher.get(key))
          }
        })
        touchedKeys.clear()
      }
    })
    new Set(watchers).forEach(watcher => watcher())
  }
}

export const model = new Model()
export const root = model.watchify({})
root.todos = model.watchify([])
*/
