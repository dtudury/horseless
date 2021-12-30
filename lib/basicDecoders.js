export function assertChar (arr, regex) {
  if (!arr[arr.i].match(regex)) {
    throw new Error(`expected ${regex}. got ${arr[arr.i]} at i=${arr.i}`)
  }
  arr.i++
}

export function readValue (arr) {
  if (arr[arr.i].isValue) {
    return arr[arr.i++]
  }
}

export function readEscaped (arr) {
  assertChar(arr, /&/)
  if (readIf(arr, 'amp;')) {
    return '&'
  } else if (readIf(arr, 'apos;')) {
    return '\''
  } else if (readIf(arr, 'gt;')) {
    return '>'
  } else if (readIf(arr, 'lt;')) {
    return '<'
  } else if (readIf(arr, 'quot;')) {
    return '"'
  } else {
    throw new Error('unhandled escape sequence')
  }
}

export function readTo (arr, regex) {
  const ss = []
  while (arr.i < arr.length) {
    const c = arr[arr.i]
    if (c.isValue || c.match(regex)) {
      return ss.join('')
    } else if (c === '&') {
      ss.push(readEscaped(arr))
    } else {
      ss.push(c)
      arr.i++
    }
  }
  return ss.join('')
}

export function skipWhiteSpace (arr) {
  readTo(arr, /\S/)
}

export function readIf (arr, str) {
  if (!str.length) {
    str = [str]
  }
  const out = []
  for (let i = 0; i < str.length; i++) {
    const char = arr[arr.i + i]
    if (!char || !char.match || !char.match(str[i])) {
      return false
    }
    out.push(char)
  }
  arr.i += str.length
  return out.join('')
}