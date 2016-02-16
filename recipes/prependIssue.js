#!/usr/bin/env node
var argv = require('yargs')
        .default('env', 'dev')
        .help('h')
        .alias('h', 'help')
        .epilog('Copyright 2015')
        .example('$0 .git/COMMIT_EDITMSG message', 'prepare-commit-msg hook (stop on non-0 exit)')
        .usage('Usage: $0 <message file name> [message source type] [SHA1 hash]')
        .demand(1)
        .argv,
    fs = require('fs'),
    childProcess = require('child_process'),
    sh = (argv.env === 'test' ) ? console.log : childProcess.execSync,
    branchName = sh('git branch | grep \'*\' | sed \'s/* //\'', { encoding: 'utf8' }).trim(),
    msgFile = argv._[0],
    issueNumber, rePattern, matches, prefix, msg;

// Don't run on rebase
if (branchName !== '(no branch)') {
    rePattern = /[a-zA-Z]+\/([0-9]+)$/;
    matches = rePattern.exec(branchName);

    if (matches !== null) {
        // Branch name is named along the lines of <label>/<issue>, so the prefix is
        // #<issue>
        issueNumber = matches[1];
        prefix = '#' + issueNumber;
    } else {
        // Prefix with branch name <branchname>
        prefix = branchName;
    }
    msg = fs.readFileSync(msgFile, 'utf8');
    msg = '[' + prefix + ']: ' + msg;
    fs.writeFileSync(msgFile, msg, 'utf8', function (err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });
}

process.exit(0);
