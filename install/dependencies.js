const { execSync } = require("child_process");

const install = (pkg) => {
    console.log(`Installing ${pkg}`);
    execSync(`npm install --no-save ${pkg}`);
}

const packages = {
    "darwin": [
    ],
    "win32": [
    ],
    "linux": [
    ]
}

if (!process.env["OPENCV4NODEJS_PREBUILT_SKIP_DEPENDENCIES"]) {
    const op = process.platform;

    console.log(`Installing prebuilt OpenCV for plattform ${op}`);
    install(`@nut-tree/opencv-${op}@4.5.5`);
    packages[op].forEach(pkg => {
        console.log(`Installing additional runtime dependency '${pkg}'`);
        install(pkg);
    });
    console.log(`Done.`);
}
