export function copyGently(a, b) {
  if (!a || !b) {
    return b
  }
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray && bIsArray) {
    a.length = b.length;
    a.forEach((v, i) => (a[i] = copyGently(v, b[i])));
    return a;
  }
  const aIsObject = a.constructor === Object;
  const bIsObject = b.constructor === Object;
  if (aIsObject && bIsObject) {
    const aKeys = new Set(Object.keys(a));
    const bKeys = new Set(Object.keys(b));
    bKeys.forEach(bKey => {
      a[bKey] = copyGently(a[bKey], b[bKey]);
      aKeys.delete(bKey);
    });
    aKeys.forEach(aKey => {
      delete a[aKey];
    });
    return a;
  }
  return b;
}
