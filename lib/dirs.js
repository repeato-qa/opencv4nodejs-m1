const { join } = require("path");

const lib = {
  win32: `opencv_world454.dll`,
  linux: `libopencv_world.so.4.5`,
  darwin: `libopencv_world.4.5.dylib`
};

const baseLibFolder = {
  win32: `${__dirname}/../node_modules/@nut-tree/opencv-win32/x64/vc16/bin`,
  linux: `${__dirname}/../node_modules/@nut-tree/opencv-linux/lib/`,
  darwin: `${__dirname}/../node_modules/@nut-tree/opencv-darwin/lib/`
};
const fullLibPath = join(baseLibFolder[process.platform], lib[process.platform]);

module.exports = {
	lib,
	baseLibFolder,
	fullLibPath
};