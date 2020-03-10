var Module = require('module')
var originalRequire = Module.prototype.require

Module.prototype.require = function (id) {
  const unpkgMatch = id.match(/^http:\/\/unpkg\.com\/(.*)/)
  if (unpkgMatch) {
    id = unpkgMatch[1]
  }
  return originalRequire.call(this, id)
}
