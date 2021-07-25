const chalk = require("chalk")

exports.log = (msg = '') => {
    console.log(chalk.gray(msg))
}

exports.info = (msg) => {
    console.log(chalk.gray(msg))
}

exports.warn = (msg) => {
    console.warn(chalk.yellow(msg))
}

exports.error = (msg) => {
    console.error(chalk.red(msg))
}

exports.clearConsole = title => {
  
}
