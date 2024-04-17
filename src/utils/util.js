/**
 * 是否为空对象
 * @param {*} val 要判断的变量
 * @returns {boolean}
 */
export function isEmptyObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]' && Object.keys(val).length === 0
}

/**
 * 是否为空数组
 * @param {*} val 要判断的变量
 * @returns {boolean}
 */
export function isEmptyArray(val) {
  return Array.isArray(val) && val.length === 0
}

/**
 * 是否为非空数组
 * @param {*} val 要判断的变量
 * @returns {boolean}
 */
export function isNotEmptyArray(val) {
  return Array.isArray(val) && val.length > 0
}
