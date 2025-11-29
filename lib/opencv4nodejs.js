const promisify = require('./promisify');
const extendWithJsSources = require('./src');
const path = require('path');

const isElectron = process.versions.hasOwnProperty('electron');
const packagePath = 'node_modules/opencv4nodejs-m1';

// On Windows, we need to add the DLL directory to PATH before loading the native module
if (process.platform === 'win32') {
  const dllDir = path.join(__dirname, '..', 'deps', 'win32', 'x64', 'vc17', 'bin');
  process.env.PATH = dllDir + path.delimiter + (process.env.PATH || '');
}

/**
 * Try to load the native binding from multiple locations:
 * 1. Prebuilds (downloaded by prebuild-install)
 * 2. Local build directory
 * 3. Electron-specific paths
 */
function loadBinding() {
  const locations = [];
  
  // Try prebuild-install location first (most common for published packages)
  try {
    const prebuildInstall = require('prebuild-install');
    const prebuildPath = prebuildInstall.getPath();
    if (prebuildPath) {
      locations.push(prebuildPath);
    }
  } catch (e) {
    // prebuild-install not available or no prebuild found
  }

  // Try node-gyp-build style prebuilds directory
  try {
    const pkg = require('../package.json');
    const prebuildsDir = path.join(__dirname, '..', 'prebuilds');
    const platform = process.platform;
    const arch = process.arch;
    const runtime = isElectron ? 'electron' : 'node';
    const abi = isElectron ? process.versions.modules : process.versions.modules;
    
    // Common prebuild naming patterns
    const patterns = [
      `${platform}-${arch}/${runtime}-v${abi}.node`,
      `${platform}-${arch}/node.napi.node`,
      `${platform}-${arch}/opencv4nodejs.node`
    ];
    
    for (const pattern of patterns) {
      locations.push(path.join(prebuildsDir, pattern));
    }
  } catch (e) {
    // Ignore errors
  }

  // Electron-specific paths
  if (isElectron) {
    try {
      const electron = require("electron");
      const appPath = (electron.app || electron.remote.app).getAppPath();
      locations.push(path.resolve(appPath, packagePath, 'build/Release/opencv4nodejs.node'));
      locations.push(path.resolve(appPath, packagePath, 'build/Release/opencv4nodejs'));
    } catch (e) {
      // Electron require failed
    }
  }

  // Local build directory (fallback for development)
  locations.push(path.join(__dirname, '..', 'build', 'Release', 'opencv4nodejs.node'));

  // Try each location
  const errors = [];
  for (const location of locations) {
    try {
      if (typeof __non_webpack_require__ !== 'undefined') {
        return __non_webpack_require__(location);
      }
      return require(location);
    } catch (e) {
      errors.push({ location, error: e.message });
      // Continue to next location
    }
  }

  // Final fallback: use bindings module
  try {
    const bindingsModule = require('bindings');
    return bindingsModule('opencv4nodejs');
  } catch (e) {
    errors.push({ location: 'bindings module', error: e.message });
    throw new Error(
      'Could not load opencv4nodejs native module. Tried locations:\n' +
      errors.map(e => `  - ${e.location}\n    Error: ${e.error}`).join('\n') +
      '\n\nMake sure you have run `npm install` and the native module was built correctly.'
    );
  }
}

const bindings = loadBinding();

// promisify async methods
let cv = promisify(bindings);
cv = extendWithJsSources(cv);

module.exports = cv;