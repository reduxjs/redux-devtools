#!/bin/bash

set -o errexit # Exit on error

git stash save
git checkout gh-pages
git pull --rebase origin master
cd examples/todomvc
webpack
git add .
if git commit -m 'rebuild todomvc bundle for demo'; then # Commit the changes, if any
  echo 'Changes Committed'
if git push --force; then # Commit the changes, if any
  echo 'Pushed succecfully'
fi
fi
git checkout master
git stash apply
