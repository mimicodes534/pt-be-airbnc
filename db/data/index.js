const ENV = process.env.NODE_ENV;

const devData = require("./dev");
const testData = require("./test");

const data = { test: testData, development: devData };

console.log(data);

module.exports = data;
