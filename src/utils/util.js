/**
 * 是否为空数组
 * @param {*} val 要判断的变量
 * @returns {boolean}
 */
export function isEmptyArray(val) {
  return Array.isArray(val) && val.length === 0
}

/**
 * 格式化选项
 * @param {string[]} choices 选项
 * @returns {{name: string, value:string}[]}
 */
export function formatChoices(choices) {
  return choices.map((choice) => ({
    name: choice,
    value: choice,
  }))
}
