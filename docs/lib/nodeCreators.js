/* global Node */

import { FRAGMENT } from './fragment.js'
import { watchFunction } from './functionWatcher.js'

function _createTextNode (str) {
  if (str.length) {
    return document.createTextNode(str)
  } else {
    return []
  }
}

function _setAttributes (element, attributes, ignoreMethod = false) {
  if (!ignoreMethod && element.setAttributes) {
    element.setAttributes(attributes)
  } else {
    Object.keys(attributes).forEach(attribute => {
      const value = attributes[attribute]
      const setValue = () => {
        let temp = value
        if (typeof temp === 'function' && !attribute.startsWith('on')) {
          temp = temp(element)
        }
        if (typeof temp === 'string' && element.getAttribute(attribute) !== temp) {
          element.setAttribute(attribute, temp)
        }
        if (temp !== '' && element[attribute] !== temp) {
          try {
            element[attribute] = temp
          } catch (e) {
            if (!(e instanceof TypeError)) { // SVGs don't like getting their properties set...
              throw e
            }
          }
        }
      }
      if (typeof value === 'function' && !attribute.startsWith('on')) {
        watchFunction(setValue)
      } else {
        setValue(value)
      }
    })
  }
  return element
}

function _flattenAndMap (arr, f) {
  if (!Array.isArray(arr)) {
    return f(arr)
  }
  return [].concat.apply([], arr.map(v => _flattenAndMap(v, f)))
}

function _createElement (tag, attributes, descriptions, xmlns) {
  if (tag === FRAGMENT) {
    return _flattenAndMap(descriptions, _createNode)
  } else if (typeof tag === 'function') {
    return tag(attributes, descriptions, xmlns)
  } if (typeof tag === 'string') {
    let element = document.createElementNS(xmlns, tag, { is: attributes.is })
    _setAttributes(element, attributes)
    render(element, descriptions)
    return element
  }
}

const _descriptionMap = new Map()
function _createNode (description) {
  if (!description) {
    return []
  } else if (description.type) {
    if (!_descriptionMap.has(description)) {
      if (description.type === 'textnode') {
        _descriptionMap.set(description, _createTextNode(description.value))
      } else {
        _descriptionMap.set(description, _createElement(description.tag, description.attributes, description.children, description.xmlns))
      }
    }
    return _descriptionMap.get(description)
  }
  return _createTextNode(description.toString())
}

export function setChildren (element, descriptions, ignoreMethod = false) {
  if (!element) {
    console.log(descriptions)
  }
  descriptions = _flattenAndMap(descriptions, description => {
    if (typeof description === 'function') {
      description = _flattenAndMap(description(element), _createNode)
    } else {
      description = _flattenAndMap(description, _createNode)
    }
    return description
  })
  if (!ignoreMethod && element.setChildren) {
    element.setChildren(descriptions)
  } else {
    descriptions.forEach((description, index) => {
      if (!(description instanceof Node)) {
        console.error(description)
        throw new Error('unhandled description')
      }
      const referenceNode = element.childNodes[index]
      if (!referenceNode) {
        element.appendChild(description)
      } else if (description !== referenceNode) {
        element.insertBefore(description, referenceNode)
      }
    })
    while (element.childNodes.length > descriptions.length) {
      element.removeChild(element.lastChild)
    }
  }
  return element
}

export function render (element, descriptions) {
  function f () {
    return setChildren(element, descriptions)
  }
  watchFunction(f)
  return f
}
