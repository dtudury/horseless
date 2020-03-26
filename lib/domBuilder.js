/* global */

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

function _constructValue (parts) {
  return parts.map(part => {
    if (typeof part === 'function') {
      part = part()
    }
    if (part == null) return ''
    if (part && part.type === 'part') {
      return part.value
    } else {
      return part.toString()
    }
  }).join('')
}

function _constructAttributes (attributes) {
  let obj = {}
  attributes.forEach(attribute => {
    if (typeof attribute === 'function') {
      attribute = attribute()
    }
    if (attribute == null) return
    if (attribute && attribute.type === 'attribute') {
      const name = attribute.name
      if (Object.prototype.hasOwnProperty.call(obj, name)) return
      obj[name] = _constructValue(attribute.value)
    } else if (Array.isArray(attribute)) {
      obj = Object.assign(_constructAttributes(attribute), obj)
    } else {
      const name = attribute.toString()
      if (Object.prototype.hasOwnProperty.call(obj, name)) return
      obj[name] = name
    }
  })
  return obj
}

function _setAttributes (element, attributes) {
  Object.entries(attributes).forEach(([name, value]) => {
    _setAttribute(element, name, value)
  })
  return element
}

function _pruneAttributes (element, newAttributes, oldAttributes) {
  // TODO: this
}

const _descriptionMap = new Map()
function _descriptionsToNodes (descriptions, xmlns) {
  if (!Array.isArray(descriptions)) {
    descriptions = [descriptions]
  }
  const nodes = []
  descriptions.forEach(description => {
    if (typeof description === 'function') {
      description = description()
    }
    if (description != null) {
      if (Array.isArray(description)) {
        nodes.push(..._descriptionsToNodes(description, xmlns))
      } else {
        if (description.tag === null) {
          nodes.push(..._descriptionsToNodes(description.children, xmlns))
        } else if (description.type) {
          if (!_descriptionMap.has(description)) {
            let node
            if (description.type === 'textnode') {
              node = document.createTextNode(description.value)
            } else {
              let oldAttributes = {}
              let newAttributes = {}
              watchFunction(() => {
                newAttributes = _constructAttributes(description.attributes)
                if (node) {
                  _setAttributes(node, newAttributes)
                  _pruneAttributes(node, newAttributes, oldAttributes)
                  oldAttributes = newAttributes
                }
              })
              node = document.createElementNS(xmlns, description.tag, { is: description.attributes.is })
              _setAttributes(node, newAttributes)
              render(node, description.children, newAttributes.xmlns || xmlns)
            }
            _descriptionMap.set(description, node)
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

function _setChildren (element, descriptions, xmlns) {
  const nodes = _descriptionsToNodes(descriptions, xmlns)
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

export function render (element, descriptions, xmlns = 'http://www.w3.org/1999/xhtml') {
  if (!descriptions) {
    return _descriptionsToNodes(element, xmlns)
  }
  function f () {
    return _setChildren(element, descriptions, xmlns)
  }
  watchFunction(f)
}
