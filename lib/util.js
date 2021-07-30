const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const { execSync } = require('child_process');
const execa = require('execa');
const gitClone = require('git-clone');
const { error, log, blue } = require('./logger')

/**
 * 实现join方法
 * @param {*} pathName 
 * @returns 
 */
const _join = (pathName) => {
    return path.join(process.cwd(), pathName);
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

/**
 * 删除目录
 * @param {*} name 
 * @returns 
 */
exports.removeDir = (name) => {
    const path = _join(name);
    return new Promise((resolve, reject) => {
        fs.remove(path).then(resolve, reject);
    })
}

/**
 * loading
 * @param {*} text 
 * @param {*} color 
 * @returns 
 */
const _spinner = (text, color = 'blue') => {
    return ora({text, color}).start();
}

exports.spinner = _spinner;

/**
 * 下载Git上的模板
 * @param {*} gitPath git地址
 * @param {*} name 目录名称
 * @returns 
 */
exports.downGit = (gitPath, name) => {
    return new Promise((resolve, reject) => {
        const path = _join(name);
        const spinner = _spinner('拉取模板中...');
        // 是否已完成
        let isDone = false;
        // 超时计时器
        let timer = setTimeout(() => {
            if(!isDone) {
                spinner.fail();
                clearTimeout(timer);
                return reject('拉取模板超时');
            } 
        }, 1000 * 60);
        // 开始拉取模板
        gitClone(gitPath, path, err => {
            isDone = true;
            clearTimeout(timer);
            if(err) {
                spinner.fail(err);
                return reject(err);
            }
            spinner.succeed('模板拉取成功');
            resolve();
        })
    })
}

/**
 * 安装依赖
 * @returns 
 */
exports.installDeps = (name) => {
    return new Promise((resolve, reject) => {
        const path = _join(name);
        const isHasYarn = hasYarn();
        const command = isHasYarn ? 'yarn' : 'npm';
        const spinner = _spinner('安装依赖中...');
        executeCommand(command, ['install'], path).then(() => {
            spinner.succeed('依赖安装完成');
            resolve();
        }, () => {
            spinner.fail('依赖安装失败');
            reject();
        });
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
        execa(command, args, {
            cwd: targetDir
        }).then(resolve, reject);
    })
}

exports.executeCommand = executeCommand;

// 全局变量
let _hasYarn = null;

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

// 全局变量
let _hasVueCli = null;
/**
 * 检测是否有vue-cli环境
 * @returns 
 */
const hasVueCli = () => {
    if(_hasVueCli != null) {
        return _hasVueCli;
    }
    try {
        execSync('vue --version', { stdio: 'ignore' });
        return (_hasVueCli = true);
    } catch (error) {
        return (_hasVueCli = false);
    }
}

exports.hasVueCli = hasVueCli;

/**
 * 安装typescript环境
 * @param {*} name 
 * @returns 
 */
exports.addTypescript = (name) => {
    // 检测是否有vue-cli
    if(!hasVueCli()) {
        error(`
            未安装vue-cli
        `);
        log(`
            =====
            请运行以下命令
        `);
        blue(`
            npm install -g @vue/cli
        `);
        log(`
            or
        `);
        blue(`
            yarn global add @vue/cli
        `);
        log(`
            =====
        `)
        return Promise.reject();
    }
    const spinner = _spinner('安装typescript环境...'); 
    return executeCommand('vue', ['add', 'typescript'], _join(name))
                .then(() => {
                    spinner.succeed('typescript环境安装成功')
                    return Promise.resolve();
                })
                .catch(() => {
                    spinner.fail('typescript环境安装失败');
                    return Promise.reject();
                });
}