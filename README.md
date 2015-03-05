# Parameters & environment for githooks

In most cases, the action will be cancelled if you exit the process with
non-zero, `process.exit(1);`.

This is based on the excellent work by [Daniel Convissor](http://www.analysisandsolutions.com/code/git-hooks-summary-cheat-sheet.htm)
and [Mark Longair](http://longair.net/blog/2011/04/09/missing-git-hooks-documentation/),
but tweaked to test using nodejs rather than bash.

As I have never used `git am`, the hooks explored do not include `applypatch-msg`,
`pre-applypatch` or `post-apply-patch`.

## git commit
CWD is set to the top level of the working tree in all of the following hooks.

### pre-commit
* Timing: before message
* Parameters: none

    node .git/hooks/pre-commit
    OLDPWD '.git'
    GIT_PREFIX: '',
    GIT_DIR: '.git',
    GIT_AUTHOR_NAME: 'Marie Hogebrandt',
    GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
    GIT_AUTHOR_DATE: '@1425539426 +0100',
    GIT_INDEX_FILE: '.git/index',
    GIT_EDITOR: ':'

### prepare-commit-msg
* Timing: after default message generated, before invoking editor
* Parameters: message file name, message source type, commit hash (??)

    node .git/hooks/prepare-commit-msg .git/COMMIT_EDITMSG message
    GIT_PREFIX: '',
    GIT_DIR: '.git',
    GIT_AUTHOR_NAME: 'Marie Hogebrandt',
    GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
    GIT_AUTHOR_DATE: '@1425539426 +0100',
    GIT_INDEX_FILE: '.git/index',
    GIT_EDITOR: ':'

### commit-msg
* Timing: inspect, edit, and format the message
* Parameters: none

    node .git/hooks/commit-msg .git/COMMIT_EDITMSG
    GIT_PREFIX: '',
    GIT_DIR: '.git',
    GIT_AUTHOR_NAME: 'Marie Hogebrandt',
    GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
    GIT_AUTHOR_DATE: '@1425539426 +0100',
    GIT_INDEX_FILE: '.git/index',
    GIT_EDITOR: ':'

### post-commit
* Timing: after commit finished
* Parameters: none
* Note: Since this is after the action, `process.exit(1);` does not stop the commit

    node .git/hooks/post-commit
    GIT_PREFIX: '',
    GIT_DIR: '.git',
    GIT_AUTHOR_NAME: 'Marie Hogebrandt',
    GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
    GIT_AUTHOR_DATE: '@1425539426 +0100',
    GIT_INDEX_FILE: '.git/index',
    GIT_EDITOR: ':'
