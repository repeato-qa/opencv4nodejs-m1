#!/usr/bin/env bash

set -ex

mkdir -p .build/tmp
npm run clean
npm run electron:rebuild
mv build/Release/opencv4nodejs.node .build/tmp/opencv4nodejs-x64.node
npm run clean
npm run electron:rebuild:arm64
mv build/Release/opencv4nodejs.node .build/tmp/opencv4nodejs-arm64.node
lipo .build/tmp/opencv4nodejs-arm64.node .build/tmp/opencv4nodejs-x64.node -create -output build/Release/opencv4nodejs.node
rm -r .build/tmp
