/* global Node */
import { FRAGMENT } from './fragment'
import { watchFunction } from './functionWatcher'

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
    return _createNodes(descriptions)
  } else if (typeof tag === 'function') {
    return tag(attributes, descriptions, xmlns)
  } if (typeof tag === 'string') {
    let element = document.createElementNS(xmlns, tag, { is: attributes.is })
    _setAttributes(element, attributes)
    watchSetChildren(element, descriptions)
    return element
  }
}

const _descriptionMap = new Map()
function _createNode (description) {
  if (!description) {
    return []
  } else if (description.type) {
    if (_descriptionMap.has(description)) {
      return _descriptionMap.get(description)
    }
    let node
    if (description.type === 'textnode') {
      node = _createTextNode(description.value)
    } else {
      node = _createElement(description.tag, description.attributes, description.children, description.xmlns)
    }
    _descriptionMap.set(description, node)
    return node
  } else if (typeof description === 'string') {
    return _createTextNode(description)
  }
  return description
}

function _createNodes (descriptions) {
  return _flattenAndMap(descriptions, _createNode)
}

export function setChildren (element, children, ignoreMethod = false) {
  if (!element) {
    console.log(children)
  }
  children = _flattenAndMap(children, child => {
    if (typeof child === 'function') {
      child = _createNodes(child(element))
    } else {
      child = _createNodes(child)
    }
    return child
  })
  if (!ignoreMethod && element.setChildren) {
    element.setChildren(children)
  } else {
    children.forEach((child, index) => {
      if (!(child instanceof Node)) {
        console.error(child)
        throw new Error('unhandled child')
      }
      const referenceNode = element.childNodes[index]
      if (!referenceNode) {
        element.appendChild(child)
      } else if (child !== referenceNode) {
        element.insertBefore(child, referenceNode)
      }
    })
    while (element.childNodes.length > children.length) {
      element.removeChild(element.lastChild)
    }
  }
  return element
}

export function watchSetChildren (element, descriptions) {
  function f () {
    return setChildren(element, descriptions)
  }
  watchFunction(f)
  return f
}
