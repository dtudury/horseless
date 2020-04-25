import { watchFunction } from './remodel.js'

function _constructValue (parts, node) {
  if (parts == null) return null
  if (typeof parts === 'function') {
    parts = parts(node)
  }
  if (Array.isArray(parts)) {
    const mappedParts = parts.map(part => {
      if (typeof part === 'function') {
        part = part(node)
      }
      if (part == null) return ''
      if (part && part.type === 'part') {
        return part.value
      } else {
        return part
      }
    })
    if (mappedParts.length === 1) {
      return mappedParts[0]
    }
    return mappedParts.join('')
  }
  return parts
}

function _renderAttributes (attributes, node) {
  let obj = {}
  attributes.forEach(attribute => {
    if (typeof attribute === 'function') {
      attribute = attribute(node)
    }
    if (attribute == null) return
    if (attribute && attribute.type === 'attribute') {
      const name = attribute.name
      if (Object.prototype.hasOwnProperty.call(obj, name)) return
      const value = _constructValue(attribute.value, node)
      if (value == null) {
        obj[name] = name
      } else {
        obj[name] = value
      }
    } else if (Array.isArray(attribute)) {
      obj = Object.assign(_renderAttributes(attribute, node), obj)
    } else if (typeof attribute === 'object') {
      Object.entries(attribute).forEach(([name, value]) => {
        if (Object.prototype.hasOwnProperty.call(obj, name)) return
        obj[name] = value
      })
    } else {
      const name = attribute.toString()
      if (Object.prototype.hasOwnProperty.call(obj, name)) return
      obj[name] = name
    }
  })
  return obj
}

function _setAttribute (element, name, value) {
  if (element[name] !== value) {
    try {
      element[name] = value
    } catch (e) {
      // SVGs don't like getting their properties set and that's okay...
    }
  }
  if (!(typeof value).match(/(?:boolean|number|string)/)) {
    value = name
  }
  const str = value.toString()
  if (element.getAttribute(name) !== str) {
    element.setAttribute(name, str)
  }
  return element
}

function _setAttributes (element, attributes) {
  Object.entries(attributes).forEach(([name, value]) => {
    _setAttribute(element, name, value)
  })
  return element
}

function _pruneAttributes (element, newAttributes, oldAttributes) {
  const orphans = new Set(Object.keys(oldAttributes))
  Object.keys(newAttributes).forEach(attribute => orphans.delete(attribute))
  orphans.forEach(attribute => {
    element.removeAttribute(attribute)
    delete element[attribute]
  })
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
        if (description.tag === null || description.tag === '') {
          nodes.push(..._descriptionsToNodes(description.children, xmlns))
        } else if (description.type) {
          if (!_descriptionMap.has(description)) {
            let node
            if (description.type === 'textnode') {
              node = document.createTextNode(description.value)
            } else {
              let oldAttributes = {}
              let newAttributes = _renderAttributes(description.attributes, node)
              node = document.createElementNS(newAttributes.xmlns || xmlns, description.tag, { is: description.attributes.is })
              _setAttributes(node, newAttributes)
              render(node, description.children, newAttributes.xmlns || xmlns)
              watchFunction(() => {
                newAttributes = _renderAttributes(description.attributes, node)
                _setAttributes(node, newAttributes)
                _pruneAttributes(node, newAttributes, oldAttributes)
                oldAttributes = newAttributes
              })
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
