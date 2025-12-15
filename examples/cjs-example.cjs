// CommonJS Example
const { add, multiply, greet, VERSION } = require('@moontai0724/npm-kickstart');

console.log('=== CommonJS Example ===');
console.log(`Package version: ${VERSION}`);
console.log(`add(5, 3) = ${add(5, 3)}`);
console.log(`multiply(4, 7) = ${multiply(4, 7)}`);
console.log(greet('Developer'));
