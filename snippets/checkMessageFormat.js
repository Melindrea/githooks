#!/usr/bin/env node
var argv = require('yargs')
        .default('env', 'dev')
        .help('h')
        .alias('h', 'help')
        .epilog('Copyright 2015')
        .example('$0 .git/COMMIT_EDITMSG', 'commit-msg hook (stop on non-0 exit)')
        .usage('Usage: $0 <message file name>')
        .demand(1)
        .argv,
    fs = require('fs'),
    childProcess = require('child_process'),
    sh = (argv.env === 'test' ) ? console.log : childProcess.execSync,
    branchName = sh('git branch | grep \'*\' | sed \'s/* //\'', { encoding: 'utf8' }).trim(),
    msgFile = argv._[0],
    errors = [], warnings = [], editor = process.env.EDITOR, editorChild,
    errorMessages = '# COMMIT MESSAGE ISSUES \n';

var checkLine = function (line, lineNumber)
{
    var rules = [
        {
            length: 50,
            message: 'First line should not be over 50 characters in length.',
            seriousness: 10,
            sign: '>'
        }, {
            length: 0,
            message: 'Second line should be empty.',
            seriousness: 10,
            sign: '>'
        }, {
            length: 1,
            message: 'Line should not empty.',
            seriousness: 10,
            sign: '<'
        }, {
            length: 72,
            message: 'Line should not be over 72 characters in length.',
            seriousness: 5,
            sign: '>'
        }
    ], validations = [], errors = [];

    if (lineNumber === 1) {
        validations.push(rules[0]);
    } else if (lineNumber === 2) {
        validations.push(rules[1]);
    } else if (lineNumber === 3) {
        validations.push(rules[2]);
        validations.push(rules[3]);
    } else {
        validations.push(rules[3]);
    }

    validations.forEach(function (validation) {
        if (validation.sign === '>' && line.length > validation.length) {
            errors.push({ message: validation.message, seriousness: validation.seriousness });
        } else if (validation.sign === '<' && line.length < validation.length) {
            errors.push({ message: validation.message, seriousness: validation.seriousness });
        }
    });

    if (errors.length > 0) {
        return errors;
    }
    return false;
}

var checkFile = function (file)
{
    var lines = fs.readFileSync(file).toString().split('\n'),
    errors = [], warnings = [];
    lines = lines.filter(function (line) {
        return line.indexOf('#') !== 0;
    });

    if (lines.length < 3) {
        errors.push([0, 'The message needs to be at least three lines long.'])
    }
    lines.forEach(function (line, index) {
        var lineNumber = index+1, invalid;

        invalid = checkLine(line, lineNumber);

        if (invalid !== false) {
            invalid.forEach (function (issue) {
                if (issue.seriousness > 5) {
                    errors.push([lineNumber, issue.message]);
                } else {
                    warnings.push([lineNumber, issue.message]);
                }
            });
        }
    });

    if (errors.length > 0 || warnings.length > 0) {
        return { errors: errors, warnings: warnings };
    }

    return false;
};

var errorFunction = function (err)
{
    console.log(err);
    return 1;
};

var fixErrors = function (file, first)
{
    var invalid = checkFile(file);

    if (invalid === false) {
        return 0;
    }

    if (first === undefined) {
        first = true;
    }

    if (first === true) {
        invalid.warnings.forEach(function (warning) {
            console.log('[Warning] Line ' + warning[0] + ': ' + warning[1]);
        });
    } else if (invalid.errors.length === 0) {
        return 0
    }

    warnings = invalid.warnings;
    errors = invalid.errors;

    errors.forEach(function (error) {
        console.log('[ERROR] Line ' + error[0] + ': ' + error[1]);
    });

    // [todo] Fix that the prompt loads during the commit
    if (errors.length > 0) {
        return 1;
    }
    // prompt.start();
    // prompt.get(
    //     [{
    //         name: 'commit',
    //         message: 'There were issues with your message! To edit it, choose Yes, to cancel commit choose No. [Y/n]'
    //     }],
    //     function (err, result) {
    //         if (err) {
    //             return errorFunction(err);
    //         } else if (result.commit.toLowerCase() === 'no' || result.commit.toLowerCase() === 'n') {
    //             return errorFunction('You cancelled the commit.');
    //         }

    //         if (editor === undefined) {
    //             return errorFunction('[ERROR]: Please set EDITOR environment variable, ex: "export EDITOR=$(which vim)".');
    //         }

    //         warnings.forEach(function (warning) {
    //             errorMessages += '# [Warning] Line ' + warning[0] + ': ' + warning[1] + '\n';
    //         });
    //         errors.forEach(function (error) {
    //             errorMessages += '# [ERROR] Line ' + error[0] + ': ' + error[1] + '\n';
    //         });

    //         fs.appendFile(file, errorMessages, function (err) {
    //             if (err) {
    //                 return errorFunction(err);
    //             }
    //         });

    //         editorChild = child_process.spawn(editor, [file], {
    //             stdio: 'inherit'
    //         });

    //         editorChild.on('exit', function (e, code) {
    //             invalid = checkFile(file);

    //             if (invalid !== false && invalid.errors.length > 0) {
    //                 fixErrors(file, false);
    //             } else {
    //                 return 0;
    //             }
    //         });
    //     }
    // );
};

process.exit(fixErrors(msgFile));
