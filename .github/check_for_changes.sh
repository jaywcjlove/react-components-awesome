#!/bin/bash

diff --brief README.md README-backup.md >/dev/null
CONTAINS_CHANGES=$?

if [ $CONTAINS_CHANGES -eq 1 ]; then
    echo '::set-output name=changes::true'
else
    echo '::set-output name=changes::false'
fi