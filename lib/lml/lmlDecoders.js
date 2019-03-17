import { skipWhiteSpace, readTo, readValue, assertChar, readIf } from './basicDecoders'
import { createTextNode, createElement } from './nodeCreators'

export function readTag (arr) {
  skipWhiteSpace(arr)
  let c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  }
  return readTo(arr, /[\s/>]/)
}

export function readAttribute (arr) {
  skipWhiteSpace(arr)
  let c = arr[arr.i]
  if (c === '/' || c === '>') {
    return
  }
  let name = readValue(arr) || readTo(arr, /[\s=]/)
  skipWhiteSpace(arr)
  assertChar(arr, /=/)
  skipWhiteSpace(arr)
  let value = readValue(arr)
  if (!value) {
    assertChar(arr, /"/)
    value = readTo(arr, /"/)
    assertChar(arr, /"/)
  }
  return { name, value }
}

export function readAttributes (arr) {
  const attributes = {}
  let attribute = readAttribute(arr)
  while (attribute) {
    attributes[attribute.name] = attribute.value
    attribute = readAttribute(arr)
  }
  return attributes
}

export function readElement (arr, xmlns) {
  assertChar(arr, /</)
  const isClosing = readIf(arr, '/')
  const tag = readTag(arr)
  const attributes = readAttributes(arr)
  xmlns = attributes.xmlns || xmlns
  const isEmpty = readIf(arr, '/')
  assertChar(arr, />/)
  const children = readChildren(arr, tag, xmlns)
  if (!tag) {
    if (children.length) {
      return children
    } else {
      return null
    }
  }
  return { tag, attributes, children, isClosing, isEmpty, xmlns }
}

export function readNode (arr, xmlns) {
  let c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  } else if (c === '<') {
    let element = readElement(arr, xmlns)
    return createElement(element)
  } else {
    return createTextNode(readTo(arr, /</))
  }
}

export function readChildren (arr, closingTag, xmlns = 'http://www.w3.org/1999/xhtml') {
  const nodes = []
  while (arr.i < arr.length) {
    let node = readNode(arr, xmlns)
    if (node) {
      if (closingTag && node.isClosing && node.tag === closingTag) {
        return nodes
      }
      nodes.push(node)
    }
  }
  return nodes
}
