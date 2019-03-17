
export function assertChar (arr, regex) {
  if (!arr[arr.i].match(regex)) {
    throw new Error(`expected ${regex}. got ${arr[arr.i]} at i=${arr.i}`)
  }
  arr.i++
}

export function readValue (arr) {
  if (arr[arr.i].isValue) {
    return arr[arr.i++].value
  }
}

export function readTo (arr, regex) {
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

export function skipWhiteSpace (arr) {
  readTo(arr, /\S/)
}

export function readIf (arr, c) {
  if (arr[arr.i] === c) {
    arr.i++
    return true
  }
  return false
}
