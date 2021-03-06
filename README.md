# Githooks

In most cases, the action will be cancelled if you exit the process with
non-zero, `process.exit(1);`.

This is based on the excellent work by [Justin Ellingwood](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks)
and [Mark Longair](http://longair.net/blog/2011/04/09/missing-git-hooks-documentation/),
but tweaked to test using nodejs rather than bash. Another good source for
information is [Atlassian's githooks tutorial](https://www.atlassian.com/git/tutorials/git-hooks/local-hooks).

As I have never used `git am`, the hooks explored do not include `applypatch-msg`,
`pre-applypatch` or `post-apply-patch`.

In all the files `__dirname` returns (unsurprisingly) `.git/hooks`.

## Basic code examples
[Process docs](http://nodejs.org/docs/latest/api/process.html)

Use `process.exit(int);` to exit, where int = 0 means success, others (preferred 1) means failure

To get the arguments, you can use `process.argv`, but I recommend [Yargs](https://github.com/bcoe/yargs)
since you can then also finetune which arguments your script requires.

`process.env` contains the environmental variables, and `process.cwd()`
gives you CWD in an easier way.

Finally, this will get you the refs emitted to STDIN:

```
var readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

rl.on('line', function (refLine) {
    var refs = refLine.split(' ');

    // refs is now an array of the references, see specific hooks for details
}).on('close', function () {
    process.exit(0);
});
```

## git commit
CWD is set to the top level of the working tree in all of the following hooks.

### pre-commit
* Timing: before message
* Parameters: none

```
node .git/hooks/pre-commit
OLDPWD '.git'
GIT_PREFIX: '',
GIT_DIR: '.git',
GIT_AUTHOR_NAME: 'Marie Hogebrandt',
GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
GIT_AUTHOR_DATE: '@1425539426 +0100',
GIT_INDEX_FILE: '.git/index',
GIT_EDITOR: ':'
```

#### Usage suggestions

    * Test
    * Lint
    * Check that prior commit is not a WIP

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

```
node .git/hooks/prepare-commit-msg .git/COMMIT_EDITMSG message
GIT_PREFIX: '',
GIT_DIR: '.git',
GIT_AUTHOR_NAME: 'Marie Hogebrandt',
GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
GIT_AUTHOR_DATE: '@1425539426 +0100',
GIT_INDEX_FILE: '.git/index',
GIT_EDITOR: ':'
```
#### Usage suggestions

    * Add issue #

### commit-msg
* Timing: inspect, edit, and format the message
* Parameters
    * message file name

```
node .git/hooks/commit-msg .git/COMMIT_EDITMSG
GIT_PREFIX: '',
GIT_DIR: '.git',
GIT_AUTHOR_NAME: 'Marie Hogebrandt',
GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
GIT_AUTHOR_DATE: '@1425539426 +0100',
GIT_INDEX_FILE: '.git/index',
GIT_EDITOR: ':'
```
#### Usage suggestions

    * Check that commit message follows rules

### post-commit
* Timing: after commit finished
* Parameters: none
* Note: Since this is after the action, `process.exit(1);` does not stop the commit.
    To get information about the commit, you could use `git rev-parse HEAD` or
    `git log -l HEAD`

```
node .git/hooks/post-commit
GIT_PREFIX: '',
GIT_DIR: '.git',
GIT_AUTHOR_NAME: 'Marie Hogebrandt',
GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
GIT_AUTHOR_DATE: '@1425539426 +0100',
GIT_INDEX_FILE: '.git/index',
GIT_EDITOR: ':'
```

#### Usage suggestions

    * Notify someone

### post-rewrite
* Timing: after rewriting action (`git commit --amend` or `git rebase`)
* Parameters
    * Type: amend if `git commit --amend`, rebase if `git rebase`
* Note: Since this is after the action, `process.exit(1);` does not stop the rewrite
* STDIN gets refs: [old sha1] [new sha1]

```
node .git/hooks/post-rewrite [amend|rebase]
GIT_PREFIX: '', (if amend)
GIT_DIR: '.git', (if amend)
GIT_AUTHOR_NAME: 'Marie Hogebrandt',
GIT_AUTHOR_EMAIL: 'marie@pineberry.com',
GIT_AUTHOR_DATE: '@1425560809 +0100',
GIT_REFLOG_ACTION: 'rebase' (if rebase)
```

#### Usage suggestions

    * Similar to post-checkout and post-merge

## git gc --auto

### pre-auto-gc
* Timing: before automatic garbage collection
* Parameters: unknown (doesn't trigger automatically)

```
node .git/hooks/pre-auto-gc
```

#### Usage suggestions

    * Notify someone
    * Abort collection

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

```
node .git/hooks/post-checkout [SHA1 hash] [SHA1 hash] [0|1]
GIT_PREFIX: '',
GIT_DIR: '.git'
```
#### Usage suggestions

    * Delete generated files
    * Update dependencies
    * Alter working directory depending on branch
    * Copy in binaries
    * Auto-generate documentation

## git rebase
CWD is set to the top level of the working tree in all of the following hooks.

### pre-rebase
* Timing: before rebase
* Parameters
    * Upstream branch name
    * Rebased branch name (empty if current branch)

```
node .git/hooks/post-checkout master test
GIT_REFLOG_ACTION: 'rebase'
```

#### Usage suggestions

    * Ensure that rebasing isn't a bad idea

## git merge or git pull
CWD is set to the top level of the working tree in all of the following hooks.

### post-merge
* Timing: after successful merge completed
* Parameters
    * Is squash (0 or 1)

```
node .git/hooks/post-merge [0|1]
GIT_PREFIX: '',
GIT_DIR: '.git',
GIT_REFLOG_ACTION: '[merge [branch]|pull]'
```
#### Usage suggestions

    * Similar to post-checkout in usage

## git push
CWD is set to the top level of the working tree in pre-push, however all
server-side scripts have CWD = `.git`. Anything printed to the terminal
is returned to the local script with "remote: " prepending every row.

### pre-push
* Timing: before pushing
* Parameters
    * Name of remote
    * Url to which the push is being done
* STDIN gets [local ref] [local sha1] [remote ref] [remote sha1] (1 line/ref)

```
node .git/hooks/pre-push origin git@something:etc
GIT_PREFIX: ''
```

#### Usage suggestions

    * Check that it's not a WIP branch (based on commit-message)

### pre-receive
* Timing: before the first ref is updated
* Parameters: none
* Note: Server-side
* STDIN gets refs: [remote sha1] [local sha1] [local ref] (1 line/ref)
* Error: ! [remote rejected] test -> test (pre-receive hook declined)

```
node .git/hooks/pre-receive
GIT_DIR: '.'
```

#### Usage suggestions

    * Check permissions on user level

### update
* Timing: before each ref is updated (so, 2 branches or tags means it's called twice)
* Parameters
    * Local ref
    * Remote sha1
    * Local sha1
* Note: Server-side. `process.exit(1);` will stop only that specific ref from being pushed
* Error: ! [remote rejected] test -> test (hook declined)

```
node .git/hooks/update refs/heads/test f3d7c49c850f9ad7559d41432496556b53599e50 b7cf9aeb4ce372c497dd0fe6057c06739a9d5bd8
GIT_DIR: '.'
```

#### Usage suggestions

    * Test
    * Lint
    * Rejecting changes that involve an upstream rebase
    * Preventing non-fast-forward merges
    * Check permissions on user/ref level

### post-receive
* Timing: after the last ref is updated
* Parameters: none
* Note: Server-side. Since this is after the action, `process.exit(1);` does not stop the push
* STDIN gets refs: [remote sha1] [local sha1] [local ref] (1 line/ref)

```
node .git/hooks/post-receive
GIT_DIR: '.'
```

#### Usage suggestions

    * Trigger CI (build + deploy)
    * Push to another remote
    * Notify someone

### post-update
* Timing: after the last ref is updated
* Parameters
    * Updated refs
* Note: Server-side. Since this is after the action, `process.exit(1);` does not stop the push

```
node .git/hooks/post-update refs_1 ref_2
GIT_DIR: '.'
```

#### Usage suggestions

    * Sync issues with Watson
