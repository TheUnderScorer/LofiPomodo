#!/bin/bash

npm run build-renderer &&
npm run build-electron &&
npm run pack-windows &&
echo "Build finish!"
