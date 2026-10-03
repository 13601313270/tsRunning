## ts-running: A TypeScript Runtime Type Validation Tool

TypeScript provides type checking for JavaScript, but we all know that TypeScript's validation happens at compile time. By the time code runs in a browser or Node.js environment, it's just plain JavaScript again. There are certain scenarios where we need runtime type validation, such as:

1. On the server side (Node.js): verifying that data received from the browser conforms to an expected structure.

2. On the client side: verifying that data returned from the server conforms to an expected structure.

To address these needs, I've developed an npm package to enable this capability.

## Installation

Install ts-running via npm:

```bash
npm i ts-running
```

## Usage

The `check` method validates whether a value conforms to a type. The first argument is a string representing the type using TypeScript syntax, and the second argument is the value to validate.

```javascript
const { check } = require('ts-running');

// Examples
check('number', 1); // true
check('{label:string}', { label: '' }); // true
check('{label?:string}[]', [{ label: 'hello' }]); // true
check('{label:string|number}', { label: 1 }); // true
check('[string,number][]', [['', 1]]); // true
check('{label:string,title:number}', { label: '', title: '' }); // false
check('"hello"|"world"', 'hello'); // true
```

The `check` method returns a boolean indicating whether the second argument matches the TypeScript type described in the first argument.
