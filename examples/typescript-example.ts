import { add, multiply, greet, VERSION } from '@moontai0724/npm-kickstart';

// Type-safe usage in TypeScript
const sum: number = add(10, 20);
const product: number = multiply(5, 6);
const message: string = greet('TypeScript User');

console.log('=== TypeScript Example ===');
console.log(`Version: ${VERSION}`);
console.log(`Sum: ${sum}`);
console.log(`Product: ${product}`);
console.log(message);

// TypeScript will catch type errors
// const invalid = add("5", "3"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
