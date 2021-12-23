const promisify = require('./promisify');
const extendWithJsSources = require('./src');

let cv = require("bindings")("opencv4nodejs");
console.log(`Required cv`, cv);

// promisify async methods
cv = promisify(cv);
cv = extendWithJsSources(cv);

module.exports = cv;