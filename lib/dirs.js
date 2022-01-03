const { join } = require("path");

const lib = {
  win32: `opencv_world455.dll`,
  linux: `libopencv_world.so.405`,
  darwin: `libopencv_world.405.dylib`
};

const baseLibFolder = {
  win32: join(__dirname, "..", "node_modules", "@nut-tree", "opencv-win32", "x64", "vc16", "bin").replace(/\\/g, '\\\\'),
  linux: join(__dirname, "..", "node_modules", "@nut-tree", "opencv-linux", "lib/"),
  darwin: join(__dirname, "..", "node_modules", "@nut-tree", "opencv-darwin", "lib")
};

const libDir = baseLibFolder[process.platform];
const fullLibPath = join(libDir, lib[process.platform]).replace(/\\/g, '\\\\');

module.exports = {
	lib,
	baseLibFolder,
	fullLibPath
};