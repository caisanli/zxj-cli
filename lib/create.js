
const inquirer = require('inquirer');
const { mkDir, downGit, installDeps, executeCommand, addTypescript } = require('./util');
const { error, success  } = require('./logger');
// 支持项目类型
const PROJECT_TYPE = ['web', 'mobile'];
// 支持语言
const PROJECT_LANGUAGE = ['javascript', 'typescript'];

/**
 * 创建项目的具体实现
 * @param {*} name 项目名称
 * @param {*} options 其他参数
 */
module.exports = (name, options) => {
    // 问答列表
    const promptList = [{
        type: 'input',
        message: '请输入项目名称',
        name: 'name',
        default: name
    }, {
        type: 'list',
        message: '请选择项目类型',
        name: 'type',
        choices: PROJECT_TYPE // Web端、移动端
    }, {
        type: 'list',
        message: '请选择语言',
        name: 'language',
        choices: PROJECT_LANGUAGE
    }]
    
    inquirer.prompt(promptList).then(async answers => {
        const { name, type, language } = answers;
        try {
            // 生成项目目录
            await mkDir(name);
            // git地址
            const gitAddress = 'git@192.168.5.16:front/base-docking-uaa.git';
            // 拉取远程项目(未测试通过)
            await downGit(gitAddress, name);
            // 安装依赖
            await installDeps(name);
            // 根据语言生成不同环境
            if(type === 'web' && language === 'typescript') {
                await addTypescript(name);
            }
            success('初始化完成...');
        } catch (err) {
            // await removeDir(name);
            err && error(err);
            process.exit(1);
        }
    });
}

