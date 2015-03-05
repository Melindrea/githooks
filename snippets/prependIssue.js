var fs = require('fs'),
sh = require('execSync').run,
branchName = require('execSync').exec('git branch | grep \'*\' | sed \'s/* //\'').stdout.trim(),
msgFile = process.argv[2],
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
    msg = '[' + prefix + ']: ';
    msg += fs.readFileSync(msgFile, 'utf8');
    fs.writeFile(msgFile, msg, 'utf8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}
