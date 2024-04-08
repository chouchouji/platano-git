const chalk = require('chalk')

/**
 * 控制台打印成功的内容
 * @param {string} text 打印的内容
 */
function success(text) {
  console.log(chalk.green(text))
}

/**
 * 控制台打印错误的内容
 * @param {string} text 打印的内容
 */
function error(text) {
  console.log(chalk.red(text))
}

/**
 * 控制台打印警告的内容
 * @param {string} text 打印的内容
 */
function warning(text) {
  console.log(chalk.yellow(text))
}

/**
 * 控制台打印信息的内容
 * @param {string} text 打印的内容
 */
function info(text) {
  console.log(chalk.cyan(text))
}

module.exports = {
  success,
  error,
  warning,
  info,
}
