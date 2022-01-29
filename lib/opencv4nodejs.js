const promisify = require('./promisify');
const extendWithJsSources = require('./src');
const path = require('path');

const isElectron = process.versions.hasOwnProperty('electron');
const packagePath = 'node_modules/opencv4nodejs-prebuilt';

if (isElectron) {
  const electron = require("electron");
  const appPath = (electron.app || electron.remote.app).getAppPath();
  const modulePath = path.resolve(appPath, packagePath, 'build/Release/opencv4nodejs');
  bindings = __non_webpack_require__(modulePath);
} else {
  bindings = require('../build/Release/opencv4nodejs.node');
}

// promisify async methods
cv = promisify(bindings);
cv = extendWithJsSources(cv);

module.exports = cv;