# Parameters & environment for githooks

In most cases, the action will be cancelled if you exit the process with
non-zero, `process.exit(1);`.

This is based on the excellent work by [Daniel Convissor](http://www.analysisandsolutions.com/code/git-hooks-summary-cheat-sheet.htm)
and [Mark Longair](http://longair.net/blog/2011/04/09/missing-git-hooks-documentation/),
but tweaked to test using nodejs rather than bash. Another good source for
information is [Atlassian's githooks tutorial](https://www.atlassian.com/git/tutorials/git-hooks/local-hooks)

As I have never used `git am`, the hooks explored do not include `applypatch-msg`,
`pre-applypatch` or `post-apply-patch`.

In all the files `__dirname` returns (unsurprisingly) `.git/hooks`.

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
* Parameters
    * message file name
    * message source type
        * *message* with `-m` or `-F` option
        * *template* with `-t` option
        * *merge* (if the commit is a merge commit)
        * *squash* (if the commit is squashing other commits).
        * Empty if none of the above
    * SHA1 hash of commit (only with `-c`, `-C`, or `--amend`)

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
* Parameters
    * message file name

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
* Note: Since this is after the action, `process.exit(1);` does not stop the commit.
    To get information about the commit, you could use `git rev-parse HEAD` or
    `git log -l HEAD`

    node .git/hooks/post-commit
    GIT_PREFIX: '',
    GIT_DIR: '.git',
    GIT_AUTHOR_NAME: 'Marie Hogebrandt',
    GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
    GIT_AUTHOR_DATE: '@1425539426 +0100',
    GIT_INDEX_FILE: '.git/index',
    GIT_EDITOR: ':'

## git checkout or git clone
CWD is set to the top level of the working tree in all of the following hooks.

That this runs on `git clone` is less relevant in most cases, as it's a
user-level hook.

### post-checkout
* Timing: after worktree is changed
* Parameters
    * Previous HEAD ref
    * New HEAD ref
    * Type flag: 0 for file checkout, 1 for branch checkout
* Note: Since this is after the action, `process.exit(1);` does not stop the checkout or cloning.

    node .git/hooks/post-checkout [SHA1 hash] [SHA1 hash] [0|1]
    GIT_PREFIX: '',
    GIT_DIR: '.git'

## git rebase
CWD is set to the top level of the working tree in all of the following hooks.

### pre-rebase
* Timing: before rebase
* Parameters
    * Upstream branch name
    * Rebased branch name (empty if current branch)

    node .git/hooks/post-checkout master test
    GIT_REFLOG_ACTION: 'rebase'

## git merge or git pull
CWD is set to the top level of the working tree in all of the following hooks.

### post-merge
* Timing: after successful merge completed
* Parameters
    * Is squash (0 or 1)

    node .git/hooks/post-merge [0|1]
    GIT_PREFIX: '',
    GIT_DIR: '.git',
    GIT_REFLOG_ACTION: '[merge [branch]|pull]'
