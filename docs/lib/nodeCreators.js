/* global Node */

import { FRAGMENT } from './fragment.js'
import { watchFunction } from './functionWatcher.js'

function _renderValue (value, element) {
  if (value) {
    if (typeof value === 'function') {
      value = value(element)
    }
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return _renderValue(value[0], element)
      } else {
        return '' + value.map(v => _renderValue(v, element)).join('')
      }
    }
  }
  return value
}

function _setAttribute (element, name, value) {
  value = _renderValue(value, element)
  if (element[name] !== value) {
    element[name] = value
    try {
      element[name] = value
    } catch (e) {
      if (!(e instanceof TypeError)) { // SVGs don't like getting their properties set and that's okay...
        throw e
      }
    }
  }
  if ((typeof value).match(/(?:boolean|number|string)/)) {
    const str = '' + value
    if (element.getAttribute(name) !== str) {
      element.setAttribute(name, str)
    }
  }
  return element
}

function _setAttributes (element, attributes, ignoreMethod = false) {
  if (!ignoreMethod && element.setAttributes) {
    element.setAttributes(attributes)
  } else {
    Object.keys(attributes).forEach(name => {
      if (!name.startsWith('__callback__')) {
        watchFunction(() => {
          return _setAttribute(element, name, attributes[name])
        }, attributes[`__callback__${name}`])
      }
    })
  }
  return element
}

const _descriptionMap = new Map()
const _nodeMap = new Map()
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
            let node
            if (description.type === 'textnode') {
              node = document.createTextNode(description.value)
            } else if (typeof description.tag === 'function') {
              node = description.tag(description.attributes, description.children, description.xmlns)
            } else {
              node = document.createElementNS(description.xmlns, description.tag, { is: description.attributes.is })
              _setAttributes(node, description.attributes)
              render(node, description.children)
            }
            _descriptionMap.set(description, node)
            _nodeMap.set(node, description)
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
  const description = _nodeMap.get(element)
  if (description && description.attributes && description.attributes.__callback__) {
    description.attributes.__callback__(element)
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
