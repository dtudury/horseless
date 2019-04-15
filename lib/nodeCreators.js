/* global Node */
import { FRAGMENT } from '.'
import { watchFunction } from './functionWatcher'

function _createTextNode (str) {
  if (str.length) {
    return document.createTextNode(str)
  } else {
    return []
  }
}

export function setAttributes (element, attributes, ignoreMethod = false) {
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
        if (element.getAttribute(attribute) !== temp) {
          element.setAttribute(attribute, temp)
        }
        element[attribute] = temp
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

export function setChildren (element, children, ignoreMethod = false) {
  if (!element) {
    console.log(children)
  }
  children = children.map(child => {
    if (typeof child === 'function') {
      child = createNodes(child(element))
    }
    return child
  })
  children = [].concat.apply([], children)
  if (!ignoreMethod && element.setChildren) {
    element.setChildren(children)
  } else {
    children.forEach((child, index) => {
      if (!(child instanceof Node)) {
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

function _createElement (tag, attributes, descriptions, xmlns) {
  if (tag === FRAGMENT) {
    return createNodes(descriptions)
  } else if (typeof tag === 'function') {
    return tag(attributes, descriptions, xmlns)
  } if (typeof tag === 'string') {
    let element = document.createElementNS(xmlns, tag, { is: attributes.is })
    setAttributes(element, attributes)
    setChildrenFromDescriptions(element, descriptions)
    return element
  }
}

function _createNode (description) {
  if (!description) {
    return []
  } else if (typeof description === 'string') {
    return _createTextNode(description)
  } else if (description.tag) {
    return _createElement(description.tag, description.attributes, description.children, description.xmlns)
  } else {
    return description
  }
}

export function createNodes (descriptions) {
  if (descriptions.map) {
    descriptions = descriptions.map(_createNode)
    return [].concat.apply([], descriptions)
  }
  return _createNode(descriptions)
}

export function setChildrenFromDescriptions (element, descriptions) {
  let children = createNodes(descriptions)
  function f () {
    return setChildren(element, children)
  }
  watchFunction(f)
  return f
}
