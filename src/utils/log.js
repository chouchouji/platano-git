const chalk = require('chalk')

function success(text) {
  console.log(chalk.green(text))
}

function error(text) {
  console.log(chalk.red(text))
}

function warning(text) {
  console.log(chalk.yellow(text))
}

function info(text) {
  console.log(chalk.cyan(text))
}

module.exports = {
  success,
  error,
  warning,
  info,
}
