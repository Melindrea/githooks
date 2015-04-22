Need way to test the scripts

* Work in feature branches (ex feature/123, bug/123, task/123, hotfix/123)

## Hooks
pre-commit:
    - Run tests

prepare-commit-msg:
    - prepend issue based on branch (not if msg starts with 'WIP: ')

commit-msg:
    - Check message format

post-merge:
    - Update (needs a data file in a folder below the file directory)

post-checkout:
    - Update (needs a data file in a folder below the file directory)

pre-push:
    - Run tests
    - Don't push 'WIP: '
    - Don't allow pushing to `master`
    - Sync issues with Github (Watson)

pre-receive (production server):
    - Run tests
    - Don't accept 'WIP: '
    - Don't accept pushing to master (done by having master checked out per default)

post-receive (production server):
    - push to origin
    - Run build command

## Deploy
1. Push feature branch to Github
2. Code review/merge into `master` using PR
3. Pull into local, create branch `staging`
4. Push `staging` to production
