import { skipWhiteSpace, readTo, readToArr, readValue, assertChar, readIf } from './basicDecoders.js'
import { FRAGMENT } from './fragment.js'

function _decodeTag (arr) {
  skipWhiteSpace(arr)
  const c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  }
  return readTo(arr, /[\s/>]/)
}

function _decodeAttribute (arr) {
  skipWhiteSpace(arr)
  const c = arr[arr.i]
  if (c === '/' || c === '>') {
    return
  }
  let name = readValue(arr)
  if (name && name.isValue) {
    name = name.value
  } else {
    name = readTo(arr, /[\s=]/)
  }
  skipWhiteSpace(arr)
  assertChar(arr, /=/)
  skipWhiteSpace(arr)
  let value = readValue(arr)
  if (value && value.isValue) {
    value = value.value
  } else {
    const quote = new RegExp(arr[arr.i])
    assertChar(arr, /["']/)
    value = readToArr(arr, quote)
    assertChar(arr, quote)
  }
  return { name, value }
}

function _decodeAttributes (arr) {
  const attributes = {}
  while (true) {
    const attribute = _decodeAttribute(arr)
    if (attribute) {
      attributes[attribute.name] = attribute.value
    } else {
      return attributes
    }
  }
}

function _decodeElement (arr, xmlns) {
  assertChar(arr, /</)
  const isClosing = readIf(arr, '/')
  const tag = _decodeTag(arr) || FRAGMENT
  const attributes = _decodeAttributes(arr)
  xmlns = attributes.xmlns || xmlns
  const isEmpty = readIf(arr, '/')
  assertChar(arr, />/)
  const children = (isClosing || isEmpty) ? [] : decodeDescriptions(arr, tag, xmlns)
  return { type: 'node', tag, attributes, children, isClosing, isEmpty, xmlns }
}

function _decodeDescription (arr, xmlns) {
  const c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  } else if (c === '<') {
    return _decodeElement(arr, xmlns)
  } else {
    return { type: 'textnode', value: readTo(arr, /</) }
  }
}

export function decodeDescriptions (arr, closingTag, xmlns = 'http://www.w3.org/1999/xhtml') {
  const nodes = []
  while (arr.i < arr.length) {
    const node = _decodeDescription(arr, xmlns)
    if (node) {
      if (closingTag && node.isClosing && node.tag === closingTag) {
        return nodes
      }
      nodes.push(node)
    }
  }
  return [].concat.apply([], nodes)
}
