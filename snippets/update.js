#!/usr/bin/env node
// https://npmjs.org/package/execSync
// Executes shell commands synchronously
var argv = require('yargs').argv,
    fs = require('fs'),
    shOutput = require('execSync').exec,
    shr = require('execSync').run,
    env = (argv.env || 'dev'),
    sh = (env === 'test' ) ? console.log : require('execSync').run,
    root = __dirname + ((env === 'test') ? '/' : '/../../'),
    object, file, command, fileChanged;

try {
    object = require(root + 'githooks/data/update');
} catch (error) {
    console.log(error.message);
    console.log('Exiting with value 1');
    process.exit(1);
}

for (var i in object) {
    file = object[i].file;
    command = object[i].command;

    if (file === 'composer.lock') {
        try {
            stats = fs.lstatSync(root + 'composer.phar');
        } catch (error) {
            sh('curl -sS https://getcomposer.org/installer | php');
        }
    }

    fileChanged = (shOutput('git diff HEAD@{1} --stat -- ' + file + ' | wc -l').stdout > 0);
    if (fileChanged) {
        console.log(file + ' has changed, dependencies will be updated.');
        sh(command);
    }
}
process.exit(0);
