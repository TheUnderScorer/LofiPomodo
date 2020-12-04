#!/bin/bash

npm run build-renderer &&
npm run build-electron &&
npm run pack-macos &&
echo "Build finish!"
