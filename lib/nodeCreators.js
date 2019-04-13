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

function _createElement (tag, attributes, children, xmlns) {
  if (tag === FRAGMENT) {
    return createNodes(children)
  } else if (typeof tag === 'function') {
    return tag(attributes, children, xmlns)
  } if (typeof tag === 'string') {
    let element = document.createElementNS(xmlns, tag, { is: attributes.is })
    setAttributes(element, attributes)
    setChildren(element, createNodes(children))
    return element
  }
}

export function createNodes (children) {
  children = children.map(child => {
    if (!child) {
      return []
    } else if (typeof child === 'string') {
      return _createTextNode(child)
    } else if (child.tag) {
      return _createElement(child.tag, child.attributes, child.children, child.xmlns)
    } else {
      return child
    }
  })
  return [].concat.apply([], children)
}

export function setAttributes (element, attributes, ignoreMethod = false) {
  if (!ignoreMethod && element.setAttributes) {
    element.setAttributes(attributes)
  } else {
    Object.keys(attributes).forEach(attribute => {
      const value = attributes[attribute]
      const setValue = () => {
        let v = value
        if (typeof v.watch === 'function') {
          v = v.watch.call(element, element)
        }
        if (typeof v === 'string') {
          if (element.getAttribute(attribute) !== v) {
            element.setAttribute(attribute, v)
          }
        } else {
          element[attribute] = v
        }
      }
      if (typeof value.watch === 'function') {
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
