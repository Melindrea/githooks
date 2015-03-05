#!/usr/bin/env node
var argv = require('yargs')
    .argv,
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
