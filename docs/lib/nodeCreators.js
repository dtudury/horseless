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

function _createElement (tag, attributes, descriptions, xmlns) {
  if (tag === FRAGMENT) {
    return _descriptionsToNodes(descriptions)
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
function _descriptionToNode (description) {
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

function _descriptionsToNodes (descriptions) {
  if (!Array.isArray(descriptions)) {
    throw new Error('descriptions must be an array')
  }
  const nodes = []
  descriptions.forEach(description => {
    if (typeof description === 'function') {
      description = description()
    }
    if (Array.isArray(description)) {
      nodes.push(..._descriptionsToNodes(description))
    } else {
      const node = _descriptionToNode(description)
      if (Array.isArray(node)) {
        nodes.push(...node)
      } else {
        nodes.push(node)
      }
    }
  })
  return nodes
}

export function setChildren (element, descriptions, ignoreMethod = false) {
  if (!element) {
    console.log(descriptions)
  }
  const nodes = _descriptionsToNodes(descriptions)
  if (!ignoreMethod && element.setChildren) {
    element.setChildren(nodes)
  } else {
    nodes.forEach((node, index) => {
      if (!(node instanceof Node)) {
        console.error(node)
        throw new Error('unhandled node')
      }
      const referenceNode = element.childNodes[index]
      if (!referenceNode) {
        element.appendChild(node)
      } else if (node !== referenceNode) {
        element.insertBefore(node, referenceNode)
      }
    })
    while (element.childNodes.length > nodes.length) {
      element.removeChild(element.lastChild)
    }
  }
  return element
}

export function render (element, descriptions) {
  if (!descriptions) {
    return _descriptionsToNodes(element)
  }
  function f () {
    return setChildren(element, descriptions)
  }
  watchFunction(f)
  return f
}
