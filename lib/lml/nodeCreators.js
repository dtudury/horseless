import { setAttributes, setChildren } from '../elementHelpers'

export function createTextNode (str) {
  if (str.match(/\S/)) {
    return str
    return document.createTextNode(str)
  } else {
    return null
  }
}

export function createElement (props) {
  if (props && props.tag) {
    return props
    const tag = props.tag
    const attributes = props.attributes
    const children = props.children
    const xmlns = props.xmlns
    // return { tag, attributes, children, xmlns }
    if (typeof tag === 'function') {
      return tag(attributes, children, xmlns)
    } else if (typeof tag === 'string') {
      let element = document.createElementNS(xmlns, tag)
      setAttributes(element, attributes)
      setChildren(element, children)
      return element
    } else {
      throw new Error('unhandled tag', tag)
    }
  } else {
    return null
  }
}
