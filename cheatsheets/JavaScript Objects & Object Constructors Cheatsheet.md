# 🚀 JavaScript Objects & Object Constructors Cheatsheet

## 📦 Object Basics

### Creating Objects
```javascript
// Object literal (preferred for simple objects)
const myObject = {
  property: 'Value!',
  otherProperty: 77,
  myMethod: function() { /* do stuff */ }
};
```

### Accessing Properties
```javascript
// Dot notation (cleaner, preferred)
myObject.property; // 'Value!'

// Bracket notation (use for spaces, variables)
myObject["property with spaces"];
const variable = 'property';
myObject[variable]; // dynamic access
```

## 🏗️ Object Constructors

### Basic Constructor
```javascript
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
  this.sayName = function() {
    console.log(this.name);
  };
}

// Create instances
const player1 = new Player('steve', 'X');
const player2 = new Player('jenn', 'O');
```

### ⚠️ Safeguarded Constructor
```javascript
function Player(name, marker) {
  if (!new.target) {
    throw Error("Must use 'new' operator");
  }
  this.name = name;
  this.marker = marker;
}
```

## 🔗 Prototypes & Inheritance

### Adding Methods to Prototype
```javascript
Player.prototype.getMarker = function() {
  return this.marker;
};

// Now ALL Player instances have this method
player1.getMarker(); // works!
```

### Prototypal Inheritance
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function() {
  console.log(`Hello, I'm ${this.name}!`);
};

function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}

// Set up inheritance BEFORE creating objects
Object.setPrototypeOf(Player.prototype, Person.prototype);

const player = new Player('alice', 'X');
player.sayName(); // inherited from Person!
```

## 🔍 Key Concepts

| Concept | Description |
|---------|------------|
| **Prototype** | Object that other objects inherit from |
| **`this`** | Refers to the object instance being created/used |
| **Inheritance** | Objects can access properties/methods from their prototype chain |
| **Constructor** | Function that creates and initializes objects (use `new`) |

## ✅ Best Practices

- ✅ Use `Object.setPrototypeOf()` for inheritance
- ✅ Set up prototype chain BEFORE creating objects  
- ✅ Use object literals for simple, one-off objects
- ✅ Use constructors for objects you need to duplicate
- ❌ Don't use `Player.prototype = Person.prototype` (direct reference)
- ❌ Don't use `.__proto__` (deprecated)

## 🎯 Quick Example: Book Constructor
```javascript
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function() {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}`;
};

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
console.log(theHobbit.info()); // "The Hobbit by J.R.R. Tolkien, 295 pages, not read yet"
```