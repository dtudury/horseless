// takes a function that evaluates to true or false and static if and else responses. return function that evaluates condition and returns appropriate response
export function mapConditional (condition, a, b = []) {
  return () => condition() ? a : b
}

// takes an object and a mapping-function. returns a function that maps the object through the function and returns previously calculated mappings on future calls
export function mapEntries (object, f) {
  const map = new Map()
  return () => {
    const mappedEntries = Object.entries(object).map(([name, value]) => {
      if (!map.has(value)) {
        map.set(value, { index: 0, values: [] })
      }
      const indexedValues = map.get(value)
      if (indexedValues.values.length <= indexedValues.index) {
        indexedValues.values.push(f(value, name))
      }
      return indexedValues.values[indexedValues.index++]
    })
    // cleanup
    Object.values(object).map(value => {
      const indexedValues = map.get(value)
      if (indexedValues.index) {
        indexedValues.values = indexedValues.values.slice(0, indexedValues.index)
        indexedValues.index = 0
      } else {
        map.delete(value)
      }
    })
    return mappedEntries
  }
}
