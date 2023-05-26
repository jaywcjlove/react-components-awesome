#!/bin/bash

diff --brief README.md README-backup.md >/dev/null
CONTAINS_CHANGES=$?

if [ $CONTAINS_CHANGES -eq 1 ]; then
    echo "changes=true" >> $GITHUB_OUTPUT
else
    echo "changes=false" >> $GITHUB_OUTPUT
fi