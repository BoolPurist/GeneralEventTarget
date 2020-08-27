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

const max = new Person("max", 88);
const flo = new Person("flo", 18);


const printToString = function() {
    console.log(this.toString());
}

flo.addEventHandler("print", () => {console.log(this.toString())});
flo.addEventHandler("print", printToString);
max.addEventHandler("print", printToString)

// All callback functions of flo as listener for event print will be removed 
flo.removeFormEvent("print");

max.fireEvent("print");
// Output to console:
// max with the age of 88



});

