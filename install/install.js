const { basename, join } = require("path");
const child_process = require("child_process");
const fs = require("fs");
const log = require("npmlog");

const lib = {
  win32: `opencv_world455.dll`,
  linux: `libopencv_world.so.405`,
  darwin: `libopencv_world.405.dylib`
};

const baseLibFolder = {
  win32: `${__dirname}/../node_modules/@nut-tree/opencv-win32/x64/vc16/bin`,
  linux: `${__dirname}/../node_modules/@nut-tree/opencv-linux/lib/`,
  darwin: `${__dirname}/../node_modules/@nut-tree/opencv-darwin/lib/`
};

const includeFolder = `${__dirname}/../node_modules/@nut-tree/opencv-${process.platform}/include/opencv4/`;

const libDir = baseLibFolder[process.platform];
const fullLibPath = join(libDir, lib[process.platform]);

log.info("install", "using lib dir: " + libDir);

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

process.env["OPENCV4NODEJS_DEFINES"] = defines.join("\n");
process.env["OPENCV4NODEJS_INCLUDES"] = includes.join("\n");
process.env["OPENCV4NODEJS_LIBRARIES"] = libs.join("\n");

const buildCmd = process.env.BINDINGS_DEBUG
  ? "npm run build -- --debug"
  : "npm run build";
log.info("install", `spawning process: ${buildCmd}`);
const child = child_process.exec(
  buildCmd,
  {
    maxBuffer: 1024 * 1024 * 10,
  },
  function (err, stdout, stderr) {
    const _err = err || stderr;
    if (_err) log.error(_err);
  }
);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
