import chalk from 'chalk'

/**
 * 控制台打印成功的内容
 * @param {string} text 打印的内容
 */
export function success(text) {
  console.log(chalk.green(text))
}

/**
 * 控制台打印错误的内容
 * @param {string} text 打印的内容
 */
export function error(text) {
  console.log(chalk.red(text))
}

/**
 * 控制台打印警告的内容
 * @param {string} text 打印的内容
 */
export function warning(text) {
  console.log(chalk.yellow(text))
}

/**
 * 控制台打印信息的内容
 * @param {string} text 打印的内容
 */
export function info(text) {
  console.log(chalk.cyan(text))
}
