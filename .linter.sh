#!/bin/bash
cd /home/kavia/workspace/code-generation/petmemorybook-35801-5e344dd3/petmemorybook
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

