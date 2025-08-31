# Factory Functions & Module Pattern Cheat Sheet

> **Source**: [The Odin Project - Factory Functions and the Module Pattern](https://www.theodinproject.com/lessons/node-path-javascript-factory-functions-and-the-module-pattern)

## 1. Scope Basics

* **Global Scope**: Variables available everywhere
```js
let globalVar = 'accessible everywhere';
```

* **Function Scope**: `var` variables only available within function
* **Block Scope**: `let`/`const` variables only available within `{ }` blocks
```js
function example() {
  var funcScoped = 'function only';
  if (true) {
    const blockScoped = 'block only';
  }
  // blockScoped not accessible here!
}
```

## 2. Closures

* **What it is**: Functions remember variables from their outer scope even after that scope ends
```js
function makeAdding(firstNumber) {
  const first = firstNumber;
  return function(secondNumber) {
    return first + secondNumber; // 'first' still accessible!
  }
}

const add5 = makeAdding(5);
console.log(add5(2)); // 7
```

## 3. Problems with Constructors

* **Issues**:
  * Easy to forget `new` keyword → hard-to-debug errors
  * `instanceof` checks are unreliable
  * Look like regular functions but behave differently

## 4. Factory Functions

* **What it is**: Regular functions that create and return objects (no `new` needed)
```js
// Constructor way
function User(name) {
  this.name = name;
  this.discordName = "@" + name;
}

// Factory way
function createUser(name) {
  const discordName = "@" + name;
  return { name, discordName };
}

const user = createUser("josh"); // No 'new' needed!
```

## 5. Private Variables & Functions

* **Private variables**: Use closures to hide internal data
```js
function createUser(name) {
  const discordName = "@" + name;
  let reputation = 0; // Private!
  
  const getReputation = () => reputation;
  const giveReputation = () => reputation++;
  
  return { name, discordName, getReputation, giveReputation };
  // reputation itself is not returned - it's private!
}
```

## 6. Inheritance with Factories

* **Extending factories**: Use destructuring and Object.assign
```js
function createPlayer(name, level) {
  const { getReputation, giveReputation } = createUser(name);
  const increaseLevel = () => level++;
  
  return { name, getReputation, giveReputation, increaseLevel };
}

// Or using Object.assign
function createPlayer(name, level) {
  const user = createUser(name);
  const increaseLevel = () => level++;
  
  return Object.assign({}, user, { increaseLevel });
}
```

## 7. Module Pattern & IIFEs

* **IIFE**: Immediately Invoked Function Expression - function that runs right away
* **Module Pattern**: Wrap factory in IIFE for single-use modules
```js
const calculator = (function() {
  const add = (a, b) => a + b;
  const sub = (a, b) => a - b;
  const mul = (a, b) => a * b;
  const div = (a, b) => a / b;
  
  return { add, sub, mul, div };
})(); // <- immediately called!

calculator.add(3, 5); // 8
```

## 8. Object Shorthand & Destructuring

* **Shorthand**: When variable name = property name
```js
const name = "Bob";
const age = 28;

// Instead of { name: name, age: age }
const obj = { name, age };
```

* **Destructuring**: Extract properties into variables
```js
const obj = { a: 1, b: 2 };
const { a, b } = obj; // Creates variables a and b

const array = [1, 2, 3];
const [first, second] = array; // first = 1, second = 2
```

## Summary Table

| Concept | What It Is | Why It Matters |
|---------|------------|----------------|
| Factory Function | Function that returns objects | Safer than constructors, no `new` needed |
| Closure | Function remembers outer variables | Enables private variables/functions |
| Private Variables | Data hidden inside factory | Prevents accidental modification |
| IIFE | `(function(){})()` | Creates single-use modules |
| Module Pattern | Factory wrapped in IIFE | Encapsulation and namespacing |
| Object Shorthand | `{ name }` instead of `{ name: name }` | Cleaner object creation |
| Destructuring | `{ a, b } = obj` | Easy variable extraction |

**Key Advantage**: Factory functions + closures = clean, safe, encapsulated code without constructor pitfalls!
