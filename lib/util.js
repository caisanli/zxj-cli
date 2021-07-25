const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const { error } = require('./logger');
const downGit = require('download-git-repo');

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

exports.downGit = (address, name) => {
    return new Promise((resolve, reject) => {
        // const path = _join(name);
        const spinner = ora({text: '拉取项目模板中...', color: 'blue'}).start();
        // 是否已完成
        const isDone = false;
        // 超时计时器
        let timer = setTimeout(() => {
            if(!isDone) {
                spinner.stop();
                clearTimeout(timer);
                return reject('拉取模板超时');
            } 
        }, 1000 * 60);
        // 开始拉取模板
        downGit(address, 'temp/test', err => {
            isDone = true;
            clearTimeout(timer);
            spinner.stop();
            if(err) {
                console.log(err)
                return reject('拉取模板失败');
            }
            resolve();
        })
        
    })
    
}