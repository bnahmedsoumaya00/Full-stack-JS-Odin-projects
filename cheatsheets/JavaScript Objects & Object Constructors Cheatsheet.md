# Objects & Object Constructors Cheat Sheet


## 1. Object Basics

* **Object Literal**: Quick way to create objects.
```js
const obj = { key: 'value', num: 5 };
```

* **Accessing Properties**:
  * **Dot notation**: `obj.key`
  * **Bracket notation**: `obj['key']` — useful when property names have spaces or are dynamic

## 2. Object Constructors

* A function (capitalized by convention) used with `new` to create similar objects:
```js
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}
const player = new Player('steve', 'X');
```

* Can include methods directly:
```js
this.sayName = function() { console.log(this.name); };
```

* **Safeguard against misuse**: Ensure `new` is used.
```js
if (!new.target) throw Error("Use 'new'");
```

## 3. Prototype & Inheritance

* **Prototype**: Every JS object has a prototype it inherits from.
  * You can check with:
```js
Object.getPrototypeOf(player1) === Player.prototype
```

* **Adding shared methods**:
```js
Player.prototype.sayHello = function() {
  console.log("Hello, I'm a player!");
};
```
— accessible by all instances

* **Prototype Chain**:
  * Objects inherit up the chain (→ `Object.prototype`) to get methods like `.valueOf`, `.hasOwnProperty`, etc.

## 4. Prototypal Inheritance

* **Why use prototypes?**
  * Saves memory by sharing methods across instances.
  * Enables inheritance (child objects gaining methods from parent prototypes).

* **Set up inheritance**:
```js
Object.setPrototypeOf(Player.prototype, Person.prototype);
```
Now, `Player` gets methods from `Person` too

* **Do NOT do this**:
```js
Player.prototype = Person.prototype; // Avoid this — it causes unwanted linkages!
```

## Summary Table

| Concept | What It Is | Why It Matters |
|---------|------------|----------------|
| Object literal | `{ key: value }` | Quick and easy object creation |
| Bracket notation | `obj['key']` | Needed for dynamic or special keys |
| Constructor function | `new Player(name, marker)` | Standard pattern for many similar objects |
| `new.target` safeguard | Ensures constructor is used correctly | Prevents subtle bugs |
| Prototype | Shared object blueprint | Saves memory, centralizes shared logic |
| Inheritance via prototype | `setPrototypeOf()` for linking constructors | Enables shared behavior from parent type |

