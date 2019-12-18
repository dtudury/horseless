// https://www.w3.org/TR/SVG/paths.html#PathDataBNF

const _M = 'M'.charCodeAt(0)
const _m = 'm'.charCodeAt(0)
const _Z = 'Z'.charCodeAt(0)
const _z = 'z'.charCodeAt(0)
const _L = 'L'.charCodeAt(0)
const _l = 'l'.charCodeAt(0)
const _H = 'H'.charCodeAt(0)
const _h = 'h'.charCodeAt(0)
const _V = 'V'.charCodeAt(0)
const _v = 'v'.charCodeAt(0)
const _C = 'C'.charCodeAt(0)
const _c = 'c'.charCodeAt(0)
const _S = 'S'.charCodeAt(0)
const _s = 's'.charCodeAt(0)
const _Q = 'Q'.charCodeAt(0)
const _q = 'q'.charCodeAt(0)
const _T = 'T'.charCodeAt(0)
const _t = 't'.charCodeAt(0)
const _A = 'A'.charCodeAt(0)
const _a = 'a'.charCodeAt(0)
const _comma = ','.charCodeAt(0)

function isWhiteSpace (charCode) {
  return charCode === 9 || charCode === 10 || charCode === 12 || charCode === 14 || charCode === 32
}

function isCommaWhiteSpace (charCode) {
  return charCode === _comma || isWhiteSpace(charCode)
}

function skipWhiteSpace (o) {
  while (o.i < o.d.length && isWhiteSpace(o.d.charCodeAt(o.i))) o.i++
}

function skipCommaWhiteSpace (o) {
  while (o.i < o.d.length && isCommaWhiteSpace(o.d.charCodeAt(o.i))) o.i++
}

function decodeSign (o) {
  const sign = o.d.charAt(o.i)
  if (sign === '-' || sign === '+') {
    ++o.i
    return sign
  }
}

function decodeDecimalPoint (o) {
  const decimalPoint = o.d.charAt(o.i)
  if (decimalPoint === '.') {
    ++o.i
    return decimalPoint
  }
}

function decodeNumber (o) {
  const decimals = []
  while (o.i < o.d.length) {
    const char = o.d.charAt(o.i)
    if (!char.match(/\d/)) break
    ++o.i
    decimals.push(char)
  }
  if (decimals.length) return decimals.join('')
}

function decodeCoordinate (o) {
  const sign = decodeSign(o)
  const integerPart = decodeNumber(o)
  const decimalPoint = decodeDecimalPoint(o)
  if (decimalPoint) return Number([sign, integerPart, decimalPoint, decodeNumber(o)].join(''))
  if (integerPart) return Number([sign, integerPart].join(''))
  if (sign || decimalPoint) throw new Error('sign or decimal point with no number')
}

function decodeCoordinateSequence (o) {
  const coordinate = decodeCoordinate(o)
  if (coordinate === undefined) return []
  skipCommaWhiteSpace(o)
  return [coordinate, ...decodeCoordinateSequence(o)]
}

function decodeCoordinatePair (o) {
  const x = decodeCoordinate(o)
  if (x === undefined) return
  skipCommaWhiteSpace(o)
  const y = decodeCoordinate(o)
  if (y === undefined) return
  return { x, y }
}

function decodeCoordinatePairSequence (o) {
  const coordinatePair = decodeCoordinatePair(o)
  if (coordinatePair === undefined) return []
  skipCommaWhiteSpace(o)
  return [coordinatePair, ...decodeCoordinatePairSequence(o)]
}

function decodeCoordinatePairDouble (o) {
  const p0 = decodeCoordinatePair(o)
  if (p0 === undefined) return
  skipCommaWhiteSpace(o)
  const p1 = decodeCoordinatePair(o)
  if (p1 === undefined) return
  return [p0, p1]
}

function decodeCoordinatePairDoubleSequence (o) {
  const coordinatePairDouble = decodeCoordinatePairDouble(o)
  if (coordinatePairDouble === undefined) return []
  skipCommaWhiteSpace(o)
  return [coordinatePairDouble, ...decodeCoordinatePairDoubleSequence(o)]
}

function decodeCoordinatePairTriplet (o) {
  const p0 = decodeCoordinatePair(o)
  if (p0 === undefined) return
  skipCommaWhiteSpace(o)
  const p1 = decodeCoordinatePair(o)
  if (p1 === undefined) return
  skipCommaWhiteSpace(o)
  const p2 = decodeCoordinatePair(o)
  if (p2 === undefined) return
  return [p0, p1, p2]
}

function decodeCoordinatePairTripletSequence (o) {
  const coordinatePairTriplet = decodeCoordinatePairTriplet(o)
  if (coordinatePairTriplet === undefined) return []
  skipCommaWhiteSpace(o)
  return [coordinatePairTriplet, ...decodeCoordinatePairTripletSequence(o)]
}

function decodeFlag (o) {
  const flag = o.d.charAt(o.i)
  if (flag === '0' || flag === '1') {
    ++o.i
    return Number(flag)
  }
}

function decodeEllipticalArcArgument (o) {
  const radii = decodeCoordinatePair(o)
  if (radii === undefined) return
  skipCommaWhiteSpace(o)
  const xAxisRotation = decodeCoordinate(o)
  if (xAxisRotation === undefined) return
  skipCommaWhiteSpace(o)
  const largeArcFlag = decodeFlag(o)
  if (largeArcFlag === undefined) return
  skipCommaWhiteSpace(o)
  const sweepFlag = decodeFlag(o)
  if (sweepFlag === undefined) return
  skipCommaWhiteSpace(o)
  const p = decodeCoordinatePair(o)
  if (p === undefined) return
  return { radii, xAxisRotation, largeArcFlag, sweepFlag, p }
}

function decodeEllipticalArcArgumentSequence (o) {
  const ellipticalArcArgument = decodeEllipticalArcArgument(o)
  if (ellipticalArcArgument === undefined) return []
  skipCommaWhiteSpace(o)
  return [ellipticalArcArgument, ...decodeEllipticalArcArgumentSequence(o)]
}

function decodeDrawToCommand (o) {
  const command = { prefix: o.d.charAt(o.i) }
  ++o.i
  skipWhiteSpace(o)
  switch (command.prefix.charCodeAt(0)) {
    case _Z:
    case _z:
      break
    case _H:
    case _h:
    case _V:
    case _v:
      command.parameters = decodeCoordinateSequence(o)
      break
    case _M:
    case _m:
    case _L:
    case _l:
    case _T:
    case _t:
      command.parameters = decodeCoordinatePairSequence(o)
      break
    case _S:
    case _s:
    case _Q:
    case _q:
      command.parameters = decodeCoordinatePairDoubleSequence(o)
      break
    case _C:
    case _c:
      command.parameters = decodeCoordinatePairTripletSequence(o)
      break
    case _A:
    case _a:
      command.parameters = decodeEllipticalArcArgumentSequence(o)
      break
    default:
      console.log(o, command)
      throw new Error('unhandled command')
  }
  return command
}

export function decodePathData (d) {
  const drawToCommands = []
  const o = { d, i: 0 }
  skipWhiteSpace(o)
  while (o.i < o.d.length) {
    drawToCommands.push(decodeDrawToCommand(o))
    skipWhiteSpace(o)
  }
  return drawToCommands
}

function encodeCoordinateSequence (drawToCommand) {
  return `${drawToCommand.prefix} ${drawToCommand.parameters.join(' ')}`
}

function encodeCoordinatePairSequence (drawToCommand) {
  return `${drawToCommand.prefix} ${drawToCommand.parameters.map(parameter => `${parameter.x},${parameter.y}`).join(' ')}`
}

function encodeCoordinatePairDoubleSequence (drawToCommand) {
  return `${drawToCommand.prefix} ${drawToCommand.parameters.map(parameter => parameter.map(p => `${p.x},${p.y}`)).join(' ')}`
}

function encodeCoordinatePairTripletSequence (drawToCommand) {
  return encodeCoordinatePairDoubleSequence(drawToCommand)
}

function encodeEllipticalArcArgumentSequence (drawToCommand) {
  const parameters = drawToCommand.parameters
  return `${drawToCommand.prefix} ${parameters.map(parameter => `${parameter.radii.x},${parameter.radii.y} ${parameter.xAxisRotation} ${parameter.largeArcFlag} ${parameter.sweepFlag} ${parameter.p.x},${parameter.p.y}`)}`
}

export function encodePathData (drawToCommands) {
  return drawToCommands.map(drawToCommand => {
    switch (drawToCommand.prefix.charCodeAt(0)) {
      case _Z:
      case _z:
        return drawToCommand.prefix
      case _H:
      case _h:
      case _V:
      case _v:
        return encodeCoordinateSequence(drawToCommand)
      case _M:
      case _m:
      case _L:
      case _l:
      case _T:
      case _t:
        return encodeCoordinatePairSequence(drawToCommand)
      case _S:
      case _s:
      case _Q:
      case _q:
        return encodeCoordinatePairDoubleSequence(drawToCommand)
      case _C:
      case _c:
        return encodeCoordinatePairTripletSequence(drawToCommand)
      case _A:
      case _a:
        return encodeEllipticalArcArgumentSequence(drawToCommand)
      default:
        console.log(drawToCommand)
        throw new Error('unhandled command')
    }
  }).join(' ')
}
