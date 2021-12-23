const configName = process.argv[2]

const { basename, join } = require("path");
const fs = require("fs");

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

const includeFolder = `${__dirname}/../node_modules/@nut-tree/opencv-${process.platform}/include/opencv4/`;

const libDir = baseLibFolder[process.platform];
const fullLibPath = join(libDir, lib[process.platform]);

if (!fs.existsSync(libDir)) {
  throw new Error("library dir does not exist: " + libDir);
}

const defines = [`OPENCV4NODEJS_FOUND_LIBRARY_WORLD`];
const includes = [includeFolder];

// linkLib produces linker flags for GNU ld and BSD ld
// It generates linker flags based on the libPath, which make dealing with version numbers in lib names easier
// On Linux, it passes the full path via -l:/path/to/lib which links against the given file
// On macOS it strips the *.dylib suffix and the lib prefix and passes the result to via -l
// This results in e.g. -lopencv_world.4.1
const linkLib = () => {
  if (process.platform === "darwin") {
    return `-l${basename(lib[process.platform], ".dylib").replace("lib", "")}`;
  } else {
    return `-l:${basename(lib[process.platform])}`;
  }
};
const libs =
  process.platform === "win32"
    ? [fullLibPath]
    : // dynamically link libs if not on windows
      ["-L" + libDir].concat(linkLib()).concat("-Wl,-rpath," + libDir);

if (configName === "DEFINES") {
	console.log(defines.join("\n"));
} else if (configName === "INCLUDES") {
	console.log(includes.join("\n"));
} else if (configName === "LIBRARIES") {
	console.log(libs.join("\n"));
}