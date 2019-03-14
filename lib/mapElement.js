/* global HTMLDivElement HTMLSpanElement */

const mapping = new Map([
  [HTMLDivElement, 'div'],
  [HTMLSpanElement, 'span']
])

export function mapElementToTag (c) {
  if (c) {
    const name = mapping.get(c)
    if (name) {
      return name
    }
    return mapElementToTag(Object.getPrototypeOf(c))
  }
  return null
}

const nameMapping = new Map()
let nameMappingCount = 0
export function mapElementToName (c) {
  if (c.NAME) {
    return c.NAME
  }
  let name = nameMapping.get(c)
  if (!name) {
    name = `el-${nameMappingCount++}`
    nameMapping.set(c, name)
  }
  return name
}
