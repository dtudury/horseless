import { makeElement, setAttributes, setChildren } from './lib/elementHelpers'

let defaultXlmns

export default function h (tag, attributes = {}, ...children) {
  let element
  if (typeof tag === 'function') {
    element = tag(attributes, children, defaultXlmns)
  } else if (typeof tag === 'string') {
    element = document.createElementNS((attributes && attributes.xmlns) || defaultXlmns, tag)
    setAttributes(element, attributes)
    setChildren(element, children)
  } else if (tag === h.frag) {
    return children
  } else {
    throw new Error('unhandled tag', tag)
  }
  return element
}

h.frag = Symbol('h.frag')

h.makeElement = makeElement
h.setAttributes = setAttributes
h.setChildren = setChildren

h.customElementToTag = function (Element, namespaceURI) {
  return function tag (attributes, children) {
    const element = h.makeElement(Element, namespaceURI || defaultXlmns)
    h.setAttributes(element, attributes)
    h.setChildren(element, children)
    return element
  }
}

h.getDefaultXlmns = function () {
  return defaultXlmns
}
h.setDefaultXlmns = function (newDefaultXmlns) {
  defaultXlmns = newDefaultXmlns
}
h.resetDefaultXlmns = function (newDefaultXmlns) {
  defaultXlmns = 'http://www.w3.org/1999/xhtml'
}
h.resetDefaultXlmns()
