import { 
    GeneralEventTarget 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"

class Animal extends GeneralEventTarget {
    constructor(name) {
        super();
        this.name = name;
        
    }
}

class Person extends GeneralEventTarget {
    constructor(name, age) {
        super();
        this.name = name;
        this.age = age;
        this.nameOfPet = "Has no pet";
    }

    toString() {
        return `${this.name} with the age of ${this.age}`;
    }
}

window.addEventListener("DOMContentLoaded",() => {

const person = new Person("Flo", 21);

person.addEventHandler("from outside", function (event) {
    // event.publisher.tagName = div.
    console.log(`An ${event.publisher.tagName} element triggered me !`);
});

// A div element does not extend the class GeneralEventTarget 
// So it fires from outside the event system.
const objFromOutside = document.createElement("div");
GeneralEventTarget.fireEventOut(objFromOutside, "from outside");




});

