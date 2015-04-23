#!/usr/bin/env node
var argv = require('yargs')
        .default('env', 'dev')
        .help('h')
        .alias('h', 'help')
        .epilog('Copyright 2015')
        .example('$0', 'pre-commit hook (stop on non-0 exit)')
        .usage('Usage: $0')
        .argv,
    childProcess = require('child_process'),
    exec = childProcess.exec,
    sh = (argv.env === 'test' ) ? console.log : childProcess.execSync,
    branchName = sh('git branch | grep \'*\' | sed \'s/* //\'', { encoding: 'utf8' }).trim();

// Don't run on rebase
if (branchName !== '(no branch)') {
    exec('git diff --cached --quiet', function (hasStagedChanges) {
        'use strict';
        if (hasStagedChanges) {
            // stash unstaged changes - only test what's being committed
            sh('git stash --keep-index --quiet');

            exec('npm run preCommit', function (err, stdout, stderr) {
                console.log(stdout);

                var exitCode = 0;
                if (err) {
                    console.log(stderr);
                    exitCode = 1;
                }
                // restore stashed changes
                sh('git stash pop --quiet');
                process.exit(exitCode);
            });
        }
    });
}

process.exit(0);
