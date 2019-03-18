/* global Node */
import { FRAGMENT } from './horsyDecoders'

export function createTextNode (str) {
  if (str.match(/\S/)) {
    return document.createTextNode(str)
  } else {
    return []
  }
}

export function createElement (tag, attributes, children, xmlns, child) {
  if (tag === FRAGMENT) {
    return createNodes(children)
  }
  if (typeof tag === 'function') {
    return tag(attributes, children, xmlns, child)
  } else if (typeof tag === 'string') {
    let element = document.createElementNS(xmlns, tag, { is: attributes.is })
    setAttributes(element, attributes)
    setChildren(element, createNodes(children))
    return element
  } else {
    return child
  }
}

export function createNodes (children) {
  children = children.map(child => {
    if (!child) {
      return []
    } else if (typeof child === 'string') {
      return createTextNode(child)
    } else {
      return createElement(child.tag, child.attributes, child.children, child.xmlns, child)
    }
  })
  const flattened = [].concat.apply([], children)
  return flattened
}

export function setAttributes (element, attributes) {
  if (element.setAttributes) {
    element.setAttributes(attributes)
  } else {
    for (const attribute in attributes) {
      const value = attributes[attribute]
      if (typeof value === 'string') {
        element.setAttribute(attribute, value)
      } else {
        element[attribute] = value
      }
    }
  }
  return element
}

export function setChildren (element, children) {
  function _unpackChildren (children) {
    let expanded = []
    children.forEach(child => {
      if (child != null) {
        if (Array.isArray(child)) {
          expanded = expanded.concat(_unpackChildren(child))
        } else {
          expanded.push(child)
        }
      }
    })
    return expanded
  }
  children = _unpackChildren(children)
  if (element.setChildren) {
    element.setChildren(children)
  } else {
    children.forEach((child, index) => {
      if (['string', 'boolean', 'number', 'undefined'].indexOf(typeof child) > -1) {
        child = document.createTextNode(child)
      } else if (!(child instanceof Node)) {
        throw new Error('unhandled child', child)
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
