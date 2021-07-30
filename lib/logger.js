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

exports.blue = (msg) => {
    console.log(chalk.blue(msg))
}

exports.success = (msg) => {
    console.log(chalk.green(msg))
}

exports.clearConsole = title => {
  
}
