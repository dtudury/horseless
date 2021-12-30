import { skipWhiteSpace, readTo, readValue, readEscaped, assertChar, readIf } from './basicDecoders.js'

const _voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
const END = Symbol('end')

function _readValueParts (arr, regex) {
  const out = []
  let ss = []
  while (arr.i < arr.length) {
    const c = arr[arr.i]
    if (c.isValue) {
      if (ss.length) {
        out.push({ type: 'part', value: ss.join('') })
        ss = []
      }
      out.push(c.value)
      arr.i++
    } else if (c.match(regex)) {
      if (ss.length) {
        out.push({ type: 'part', value: ss.join('') })
      }
      return out
    } else if (c === '&') {
      ss.push(readEscaped(arr))
    } else {
      ss.push(c)
      arr.i++
    }
  }
}

function _decodeAttribute (arr) {
  skipWhiteSpace(arr)
  const c = arr[arr.i]
  if (c === '/' || c === '>') {
    return END
  }
  let name = readValue(arr)
  if (name && name.isValue) {
    return name.value
  }
  name = readTo(arr, /[\s=/>]/)
  if (!name) {
    throw new Error('attribute must have a name (dynamic attributes okay, dynamic names... sorry)')
  }
  skipWhiteSpace(arr)
  const equalSign = readIf(arr, '=')
  if (equalSign) {
    skipWhiteSpace(arr)
    let value = readValue(arr)
    if (value) {
      value = value.value
    } else {
      const quote = readIf(arr, /['"]/)
      if (quote) {
        value = _readValueParts(arr, quote)
        assertChar(arr, quote)
      } else {
        value = readTo(arr, /[\s=/>]/)
      }
    }
    return { type: 'attribute', name, value }
  } else {
    return { type: 'attribute', name }
  }
}

function _decodeAttributes (arr) {
  const attributes = []
  while (true) {
    const attribute = _decodeAttribute(arr)
    if (attribute !== END) {
      attributes.push(attribute)
    } else {
      return attributes
    }
  }
}

function _decodeTag (arr) {
  skipWhiteSpace(arr)
  const c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  }
  return readTo(arr, /[\s/>]/)
}

function _decodeElement (arr) {
  const c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  } else if (c === '<') {
    assertChar(arr, /</)
    const isClosing = readIf(arr, '/')
    const tag = _decodeTag(arr)
    const isVoid = _voidElements.has(tag)
    const attributes = _decodeAttributes(arr)
    const isEmpty = readIf(arr, '/') || isVoid
    assertChar(arr, />/)
    const children = (isClosing || isEmpty) ? [] : _decodeElements(arr, tag)
    if (isVoid && isClosing) return null
    return { type: 'node', tag, attributes, children, isClosing }
  } else {
    return { type: 'textnode', value: readTo(arr, /</) }
  }
}

function _decodeElements (arr, closingTag) {
  const nodes = []
  while (arr.i < arr.length) {
    const node = _decodeElement(arr)
    if (node != null) {
      if (node.isClosing) {
        if (closingTag != null) {
          return nodes
        }
      } else {
        delete node.isClosing
        nodes.push(node)
      }
    }
  }
  return [].concat.apply([], nodes)
}

export function h (strings, ...values) {
  const ss = [strings[0].split('')]
  for (let i = 0; i < values.length; i++) {
    ss.push({ value: values[i], isValue: true })
    ss.push(strings[i + 1].split(''))
  }
  const arr = [].concat.apply([], ss)
  arr.i = 0
  return _decodeElements(arr, null)
}
