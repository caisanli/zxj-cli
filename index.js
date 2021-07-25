#!/usr/bin/env node

const version = require('./package.json').version;
const { program } = require('commander');

program.version(version);
program.parse(process.argv);
program.command();

