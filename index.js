#!/usr/bin/env node
var argv = require('yargs')
    .argv,
    readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    gitKeys = Object.keys(process.env).filter(function (key) {
        return (key.lastIndexOf('GIT_', 0) === 0);
    }),
    gitObject = {};

gitKeys.forEach(function (key) {
    gitObject[key] = process.env[key];
});
console.log('Args:', argv);
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log(gitObject);

rl.on('line', function (cmd) {
  console.log('STIDIN: ' + cmd);
});
