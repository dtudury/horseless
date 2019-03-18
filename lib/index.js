import { readChildren } from './horsyDecoders'
import { createNodes } from './nodeCreators'

export default function horsy (strings, ...values) {
  const ss = [strings[0].split('')]
  for (let i = 0; i < values.length; i++) {
    ss.push({ value: values[i], isValue: true })
    ss.push(strings[i + 1].split(''))
  }
  const arr = [].concat.apply([], ss)
  arr.i = 0
  return createNodes(readChildren(arr))
}
