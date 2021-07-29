const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const { execSync } = require('child_process');
const execa = require('execa');
const { error } = require('./logger');
const downGit = require('download-git-repo');
const gitClone = require('git-clone')
/**
 * 实现join方法
 * @param {*} pathName 
 * @returns 
 */
const _join = (pathName) => {
    return path.join(__dirname, pathName);
}

exports._join = _join;

/**
 * 创建目录
 * @param {*} name 目录名称
 */
exports.mkDir = (name) => {
    const path = _join(name);
    return new Promise((resolve, reject) => {
        fs.stat(path, err => {
            if(!err) {
                return reject(`"${name}" 文件夹已存在，请删除后重试。`);
            }
            fs.ensureDir(path).then(resolve, reject);
        })
    }) 
}

const spinner = (text, color = 'blue') => {
    const spinner = ora({text, color}).start();
    return () => {
        spinner.stop();
    }
}

/**
 * 下载Git上的模板
 * @param {*} address git地址
 * @param {*} name 目录名称
 * @returns 
 */
exports.downGit = (address, name) => {
    return new Promise((resolve, reject) => {
        // const path = _join(name);
        const spinnerStop = spinner('拉取模板中...');
        // 是否已完成
        let isDone = false;
        // 超时计时器
        let timer = setTimeout(() => {
            if(!isDone) {
                spinnerStop();
                clearTimeout(timer);
                return reject('拉取模板超时');
            } 
        }, 1000 * 60);
        // 开始拉取模板
        gitClone(address, './temp/test', err => {
            isDone = true;
            clearTimeout(timer);
            spinnerStop();
            if(err) {
                return reject(err);
            }
            resolve();
        })
    })
}

/**
 * 安装依赖
 * @returns 
 */
exports.installDeps = () => {
    return new Promise((resolve, reject) => {
        const isHasYarn = hasYarn();
        const command = isHasYarn ? 'yarn' : 'npm';
        const spinnerStop = spinner('安装中...');
        executeCommand(command, ['install']).then(() => {
            spinnerStop();
            resolve();
        }, () => {
            spinnerStop();
            reject();
        });
        // resolve();
    })
}

/**
 * 执行命令
 * @param {*} command 
 * @param {*} args 
 * @param {*} targetDir 
 * @returns 
 */
const executeCommand = (command, args, targetDir) => {
    return new Promise((resolve, reject) => {
        execa(command, args).then(resolve, reject);
    })
}

exports.executeCommand = executeCommand;

// 全局变量
let _hasYarn = false;

/**
 * 检验是否支持Yarn
 * @returns 
 */
const hasYarn = () => {
    if (_hasYarn != null) {
      return _hasYarn
    }
    try {
      execSync('yarn --version', { stdio: 'ignore' })
      return (_hasYarn = true)
    } catch (e) {
      return (_hasYarn = false)
    }
}

exports.hasYarn = hasYarn;