#!/usr/bin/env node
var argv = require('yargs')
        .default('env', 'dev')
        .help('h')
        .alias('h', 'help')
        .epilog('Copyright 2015')
        .example('$0', 'post-merge hook (no stop on non-0 exit)')
        .usage('Usage: $0 [is squash]')
        .argv,
    fs = require('fs'),
    childProcess = require('child_process'),
    sh = (argv.env === 'test' ) ? console.log : childProcess.execSync,
    root = __dirname + ((argv.env === 'test') ? '' : '/../..'),
    object, file, command, fileChanged;

try {
    object = require(root + '/githooks/data/update');
} catch (error) {
    console.log(error.message);
    process.exit(1);
}

for (var i in object) {
    file = object[i].file;
    command = object[i].command;

    if (file === 'composer.lock') {
        try {
            stats = fs.lstatSync(root + '/composer.phar');
        } catch (error) {
            sh('curl -sS https://getcomposer.org/installer | php');
        }
    }

    fileChanged = (sh('git diff HEAD@{1} --stat -- ' + file + ' | wc -l').stdout > 0);
    if (fileChanged) {
        console.log(file + ' has changed, dependencies will be updated.');
        sh(command);
    }
}

process.exit(0);
