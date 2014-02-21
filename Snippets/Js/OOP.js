/*
 * OOP.js
 * Copyright (C) 2014 ronan <ronan@cider.local>
 *
 * Distributed under terms of the MIT license.
 * Source: http://stackoverflow.com/a/387733/490589
 */

// Define a class like this
function Person(name, gender){

    // Add object properties like this
    this.name = name;
    this.gender = gender;
}

// Add methods like this.  All Person objects will be able to invoke this
Person.prototype.speak = function(){
    alert("Howdy, my name is" + this.name);
}

// Instantiate new objects with 'new'
var person = new Person("Bob", "M");

// Invoke methods like this
person.speak(); // alerts "Howdy, my name is Bob"*/
