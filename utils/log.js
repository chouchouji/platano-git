const chalk = require("chalk");

function success(text) {
  console.log(chalk.green(text));
}

function error(text) {
  console.log(chalk.red(text));
}

function warning(text) {
  console.log(chalk.yellow(text));
}

module.exports = {
  success,
  error,
  warning,
};
