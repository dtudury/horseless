import { setChildren } from "../lib/elementHelpers";

function _createText (str) {
  if (str.match(/\S/)) {
    return document.createTextNode(str)
  } else {
    return null
  }
}

function _assertChar (arr, char) {
  if (arr[arr.i] !== char) {
    throw new Error(`expected ${char}. got ${arr[arr.i]} at i=${arr.i}`)
  }
  arr.i++
}

function _readValue (arr) {
  if (arr[arr.i].isValue) {
    return arr[arr.i++].value
  }
}

function _readTo (arr, regex) {
  let ss = []
  while (arr.i < arr.length) {
    let c = arr[arr.i]
    if (c.isValue || c.match(regex)) {
      return ss.join('')
    } else {
      ss.push(c)
      arr.i++
    }
  }
  return ss.join('')
}

function _skipWhiteSpace (arr) {
  _readTo(arr, /\S/)
}

function _readIf (arr, c) {
  if (arr[arr.i] === c) {
    arr.i++
    return true
  }
  return false
}

function _readTag (arr) {
  _skipWhiteSpace(arr)
  let c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  }
  return _readTo(arr, /[\s/>]/)
}

function _readAttribute (arr) {
  _skipWhiteSpace(arr)
  let c = arr[arr.i]
  if (c === '/' || c === '>') {
    return
  }
  let name = _readValue(arr) || _readTo(arr, /[\s=]/)
  _skipWhiteSpace(arr)
  _assertChar(arr, '=')
  _skipWhiteSpace(arr)
  let value = _readValue(arr) 
  if (!value) {
    _assertChar(arr, '"')
    value = _readTo(arr, /"/)
    _assertChar(arr, '"')
  }
  return {name, value}
}

function _readAttributes (arr) {
  const attributes = []
  let attribute = _readAttribute(arr)
  while (attribute) {
    attributes.push(attribute)
    attribute = _readAttribute(arr)
  }
  return attributes
}

function _readElement (arr) {
  _assertChar(arr, '<')
  const isClosing = _readIf(arr, '/')
  const tag = _readTag(arr)
  const attributes = _readAttributes(arr)
  _skipWhiteSpace(arr)
  const isEmpty = _readIf(arr, '/')
  _assertChar(arr, '>')
  const children = _readChildren(arr, tag)
  return {tag, attributes, children, isClosing, isEmpty}
}

function _readNode (arr) {
  let c = arr[arr.i]
  if (c.isValue) {
    arr.i++
    return c.value
  } else if (c === '<') {
    return _readElement(arr)
  } else {
    let str = _readTo(arr, /</)
    return _createText(str)
  }
}

function _readChildren(arr, closingTag) {
  const nodes = []
  while (arr.i < arr.length) {
    let node = _readNode(arr)
    if (node) {
      if (closingTag && node.isClosing && node.tag === closingTag) {
        return nodes
      }
      nodes.push(node)
    }
  }
  return nodes
}

function lml (strings, ...values) {
  const ss = [strings[0].split('')]
  for (let i = 0; i < values.length; i++) {
    ss.push({ value: values[i], isValue: true })
    ss.push(strings[i + 1].split(''))
  }
  const arr = [].concat.apply([], ss)
  arr.i = 0
  return _readChildren(arr)
}

console.log(lml`   asdf  ${[1, 2, 3]}asdf`)
console.log(lml`   ${{ a: 1 }}asdf`)
console.log(lml` <qwer>${'asdf'}</qwer>`)
console.log(lml` <qwer a="o">asdf</qwer>`)
console.log(lml`<asdf a=${[1,2]}/>`)