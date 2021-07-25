#!/usr/bin/env node

// 获取version
const version = require('../package.json').version;
const program = require('commander');
const create  = require('../lib/create')
program.version(version, '-v, --version');


// 创建create命令
program
    .command('create <name>')
    .description('创建项目')
    .action((name, options) => {
        create(name, options);
    });

// 监听未定义命令
program.on('command:*', function () {
    console.error('不要乱写...');
    process.exit(1);
});

program.parse(process.argv);