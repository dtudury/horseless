// https://www.w3.org/TR/SVG/paths.html#PathDataBNF

function matchOrNothing (o, regexp) {
  const char = o.d.charAt(o.i)
  if (char.match(regexp)) {
    ++o.i
    return char
  }
}

function decodeNumber (o) {
  let char = matchOrNothing(o, /\d/)
  if (!char) return
  const decimals = []
  while (char) {
    decimals.push(char)
    char = matchOrNothing(o, /\d/)
  }
  return decimals.join('')
}

function decodeCoordinate (o) {
  const sign = matchOrNothing(o, /-+/)
  const integerPart = decodeNumber(o)
  const decimalPoint = matchOrNothing(o, /\./)
  if (decimalPoint) return Number([sign, integerPart, decimalPoint, decodeNumber(o)].join(''))
  if (integerPart) return Number([sign, integerPart].join(''))
  if (sign || decimalPoint) throw new Error('sign or decimal point with no number')
}

function decodeCoordinateSequence (o) {
  const coordinate = decodeCoordinate(o)
  if (coordinate === undefined) return []
  while (matchOrNothing(o, /[\s,]/));
  return [coordinate, ...decodeCoordinateSequence(o)]
}

function decodeCoordinatePair (o) {
  const x = decodeCoordinate(o)
  if (x === undefined) return
  while (matchOrNothing(o, /[\s,]/));
  const y = decodeCoordinate(o)
  if (y === undefined) return
  return { x, y }
}

function decodeCoordinatePairList (o, length) {
  const list = []
  while (length--) {
    const p = decodeCoordinatePair(o)
    if (p === undefined) return
    list.push(p)
    while (matchOrNothing(o, /[\s,]/));
  }
  return list
}

function decodeCoordinatePairListSequence (o, length) {
  const coordinatePairList = decodeCoordinatePairList(o, length)
  if (coordinatePairList === undefined) return []
  while (matchOrNothing(o, /[\s,]/));
  return [coordinatePairList, ...decodeCoordinatePairListSequence(o, length)]
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
  while (matchOrNothing(o, /[\s,]/));
  const xAxisRotation = decodeCoordinate(o)
  if (xAxisRotation === undefined) return
  while (matchOrNothing(o, /[\s,]/));
  const largeArcFlag = decodeFlag(o)
  if (largeArcFlag === undefined) return
  while (matchOrNothing(o, /[\s,]/));
  const sweepFlag = decodeFlag(o)
  if (sweepFlag === undefined) return
  while (matchOrNothing(o, /[\s,]/));
  const p = decodeCoordinatePair(o)
  if (p === undefined) return
  return { radii, xAxisRotation, largeArcFlag, sweepFlag, p }
}

function decodeEllipticalArcArgumentSequence (o) {
  const ellipticalArcArgument = decodeEllipticalArcArgument(o)
  if (ellipticalArcArgument === undefined) return []
  while (matchOrNothing(o, /[\s,]/));
  return [ellipticalArcArgument, ...decodeEllipticalArcArgumentSequence(o)]
}

export function decodePathData (d) {
  const drawToCommands = []
  const o = { d, i: 0 }
  while (matchOrNothing(o, /\s/));
  while (o.i < o.d.length) {
    const command = { prefix: o.d.charAt(o.i) }
    ++o.i
    while (matchOrNothing(o, /\s/));
    switch (command.prefix.charAt(0)) {
      case 'Z':
      case 'z':
        break
      case 'H':
      case 'h':
      case 'V':
      case 'v':
        command.parameters = decodeCoordinateSequence(o)
        break
      case 'M':
      case 'm':
      case 'L':
      case 'l':
      case 'T':
      case 't':
        command.parameters = decodeCoordinatePairListSequence(o, 1)
        break
      case 'S':
      case 's':
      case 'Q':
      case 'q':
        command.parameters = decodeCoordinatePairListSequence(o, 2)
        break
      case 'C':
      case 'c':
        command.parameters = decodeCoordinatePairListSequence(o, 3)
        break
      case 'A':
      case 'a':
        command.parameters = decodeEllipticalArcArgumentSequence(o)
        break
      default:
        console.log(o, command)
        throw new Error('unhandled command')
    }
    drawToCommands.push(command)
    while (matchOrNothing(o, /\s/));
  }
  return drawToCommands
}

function encodeCoordinateSequence (drawToCommand) {
  return `${drawToCommand.prefix} ${drawToCommand.parameters.join(' ')}`
}

function encodeCoordinatePairListSequence (drawToCommand) {
  return `${drawToCommand.prefix} ${drawToCommand.parameters.map(parameter => parameter.map(p => `${p.x},${p.y}`)).join(' ')}`
}

function encodeEllipticalArcArgumentSequence (drawToCommand) {
  const parameters = drawToCommand.parameters
  return `${drawToCommand.prefix} ${parameters.map(parameter => `${parameter.radii.x},${parameter.radii.y} ${parameter.xAxisRotation} ${parameter.largeArcFlag} ${parameter.sweepFlag} ${parameter.p.x},${parameter.p.y}`)}`
}

export function encodePathData (drawToCommands) {
  return drawToCommands.map(drawToCommand => {
    switch (drawToCommand.prefix.charAt(0)) {
      case 'Z':
      case 'z':
        return drawToCommand.prefix
      case 'H':
      case 'h':
      case 'V':
      case 'v':
        return encodeCoordinateSequence(drawToCommand)
      case 'M':
      case 'm':
      case 'L':
      case 'l':
      case 'T':
      case 't':
      case 'S':
      case 's':
      case 'Q':
      case 'q':
      case 'C':
      case 'c':
        return encodeCoordinatePairListSequence(drawToCommand)
      case 'A':
      case 'a':
        return encodeEllipticalArcArgumentSequence(drawToCommand)
      default:
        console.log(drawToCommand)
        throw new Error('unhandled command')
    }
  }).join(' ')
}
