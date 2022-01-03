const configName = process.argv[2]

const { basename, join } = require("path");
const fs = require("fs");

const lib = {
  win32: `opencv_world455.lib`,
  linux: `libopencv_world.so.405`,
  darwin: `libopencv_world.405.dylib`
};

const baseLibFolder = {
  win32: join(__dirname, "..", "deps", "win32", "x64", "vc16", "lib").replace(/\\/g, '\\\\'),
  linux: join(__dirname, "..", "deps", "linux"),
  darwin: join(__dirname, "..", "deps", "darwin")
};

const includeFolder = {
  win32: join(__dirname, "..", "deps", "include").replace(/\\/g, '\\\\'),
  linux: join(__dirname, "..", "deps", "include"),
  darwin: join(__dirname, "..", "deps", "include"),
};

const libDir = baseLibFolder[process.platform];
const fullLibPath = join(libDir, lib[process.platform]).replace(/\\/g, '\\\\');

if (!fs.existsSync(libDir)) {
  throw new Error("library dir does not exist: " + libDir);
}

const defines = [`OPENCV4NODEJS_FOUND_LIBRARY_WORLD`];
const includes = [includeFolder[process.platform]];

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