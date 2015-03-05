#!/usr/bin/env node
var argv = require('yargs')
    .argv;

console.log('Args:', argv);
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('env', process.env);
