/* global Node */

import { watchFunction } from '/unpkg/horseless.remodel/remodel.js'

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
    try {
      element[name] = value
    } catch (e) {
      // SVGs don't like getting their properties set and that's okay...
    }
  }
  if ((typeof value).match(/(?:boolean|number|string)/)) {
    const str = value.toString()
    if (element.getAttribute(name) !== str) {
      element.setAttribute(name, str)
    }
  }
  return element
}

function _setAttributes (element, attributes) {
  const obj = {}
  watchFunction(() => {
    Object.keys(attributes).forEach(name => {
      obj[name] = obj[name] || watchFunction(() => {
        return _setAttribute(element, name, attributes[name])
      })
    })
    // TODO: delete missing keys
  })
  return element
}

const _descriptionMap = new Map()
const _nodeMap = new Map()
function _descriptionsToNodes (descriptions) {
  if (!Array.isArray(descriptions)) {
    descriptions = [descriptions]
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
        if (description.tag === null) {
          nodes.push(..._descriptionsToNodes(description.children))
        } else if (description.type) {
          if (!_descriptionMap.has(description)) {
            let node
            if (description.type === 'textnode') {
              node = document.createTextNode(description.value)
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

function _setChildren (element, descriptions) {
  const nodes = _descriptionsToNodes(descriptions)
  nodes.forEach((node, index) => {
    // TODO: LCS https://rosettacode.org/wiki/Longest_common_subsequence#JavaScript
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
