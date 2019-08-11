/* global Node */

import { FRAGMENT } from './fragment.js'
import { watchFunction } from './functionWatcher.js'

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
            if (!(e instanceof TypeError)) { // SVGs don't like getting their properties set and that's okay...
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

const _descriptionMap = new Map()
function _descriptionsToNodes (descriptions) {
  if (!Array.isArray(descriptions)) {
    throw new Error('descriptions must be an array')
  }
  const nodes = []
  descriptions.forEach(description => {
    if (typeof description === 'function') {
      description = description()
    }
    if (description) {
      if (Array.isArray(description)) {
        nodes.push(..._descriptionsToNodes(description))
      } else {
        if (description.tag === FRAGMENT) {
          nodes.push(..._descriptionsToNodes(description.children))
        } else if (description.type) {
          if (!_descriptionMap.has(description)) {
            if (description.type === 'textnode') {
              _descriptionMap.set(description, document.createTextNode(description.value))
            } else if (typeof description.tag === 'function') {
              _descriptionMap.set(description.tag(description.attributes, description.children, description.xmlns))
            } else {
              let element = document.createElementNS(description.xmlns, description.tag, { is: description.attributes.is })
              _setAttributes(element, description.attributes)
              render(element, description.children)
              _descriptionMap.set(description, element)
            }
          }
          nodes.push(_descriptionMap.get(description))
        } else {
          nodes.push(document.createTextNode(description.toString()))
        }
      }
    }
  })
  return nodes
}

function _setChildren (element, descriptions, ignoreMethod = false) {
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
    return _setChildren(element, descriptions)
  }
  watchFunction(f)
  return f
}
