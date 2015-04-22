#!/usr/bin/env node
var argv = require('yargs')
        .default('env', 'dev')
        .help('h')
        .alias('h', 'help')
        .epilog('Copyright 2015')
        .example('$0', 'post-merge hook (no stop on non-0 exit)')
        .usage('Usage: $0 [is squash]')
        .argv,
    childProcess = require('child_process'),
    sh = (argv.env === 'test' ) ? console.log : childProcess.execSync;

sh('git submodule init');
sh('git submodule update');

process.exit(0);
