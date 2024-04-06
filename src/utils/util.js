function isEmptyObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]' && Object.keys(val).length === 0
}

function isEmptyArray(val) {
  return Array.isArray(val) && val.length === 0
}

function isNotEmptyArray(val) {
  return Array.isArray(val) && val.length > 0
}

function isString(val) {
  return typeof val === 'string'
}

module.exports = {
  isEmptyObject,
  isEmptyArray,
  isNotEmptyArray,
  isString,
}
