/**
 * 是否为空数组
 * @param {*} val 要判断的变量
 * @returns {boolean}
 */
export function isEmptyArray(val: unknown) {
  return Array.isArray(val) && val.length === 0
}
