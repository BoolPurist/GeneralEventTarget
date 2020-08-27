# How-To with code examples

It is assumed that you use instances of a class which extends
the class GeneralEventTarget

So lets make instances of class person and class animal ready to be used for the event system.

```javascript
class Animal extends GeneralEventTarget {
// ... code
}

class Person extends GeneralEventTarget {
// ... code
}
```

## Attaching events and callback functions and trigger the callfunktion by firing the event

Simple example

```javascript
// animal and person extend the GeneralEventTarget
const person = new Person();
// person is now a listener for the event "click" with the arrow function as callback function in the system
person.addEventHandler("click", () => {console.log("I reacted to the fired event !")});
// The event of type "click" is fired and causes a listeners for this event
// to invocate their callback function
// so the console will read now "I reacted to the fired event !"
const animal = new Animal();
animal.fireEvent("click");
```

Example of the usage of the general event object provided by the module provided for every callback function
Here are the following properties of the event object in action:

- event.publisher: Reference to the publisher of the event  
- event.args: Array of arguments provided by the publisher via the rest parameter in the function fireEvent

To give a callback function access to the event object, just define one argument in the function.
Name for the parameter does not matter

```javascript
const person = new Person("Flo");
// person.name = Flo
const animal = new Animal("Max");
//animal.name = Max
// person is now listener for the event change
// The event parameter is the general event instance provided for certain information
person.addEventHandler("change", function (event) {
    this.name = event.args[0]; // = Otto
    this.nameOfPet = event.publisher.name; // event.publisher = animal
    console.log(`Name: ${this.name}, Name of Pet: ${this.nameOfPet}`);
    // Console will read the following message
    // Name: Otto, Name of Pet: Max
});
// animal is the publisher of the fired event
animal.fireEvent("change", "Otto"); // Otto is the 1. and only argument provided for the callback functions
```

**Caution about the this keyword and arrow function as callback function**:

> Arrow functions do not bind the this keyword. This means the
> internal mechanism can not bind the this keyword to the reference
> to the listener. If you want to use the this keyword in this sense
> then you need to use a normal anonymous function like above in the example

**Do not alter the event object**:

> The argument event as a general event given here is immutable.
> If you try to alter anything about it, you get an error.
> This prevents possible bugs if more than one callback function is triggered and the event object
> would be changed by one callback function.

**Way of getting changeable argument values by copying values form  the event object in a callback function scope**
**via deconstructing**:

> if you really want to change the value of the arguments provided by the event object.
> you can do it at least in the function scope without violating the rule of
> changing the event object via assinging the values to variables or better deconstructing the argument array
> Example with deconstructing the argument array

```javascript
const person = new Person("Flo", 17);
// person.age = 17
const police = new Person("Police");

person.addEventHandler("check", function(event) {
    // mandatoryAgeBorder is a number here at the start of the callback function.

    let [mandatoryAgeBorder, textIfAllowed, textIfNot] = event.args;
    // event.args = [21 or 16, "May enjoy having a bottle of beer", "Is not allowed to drink beer"]
    // mandatoryAgeBorder will be changed here which is okay
    // because it is copied from the event object via deconstructing.
    if (this.age < mandatoryAgeBorder ) { // this.age = 17
        mandatoryAgeBorder = `${this.name}: ${textIfNot}`;
    } else {
        mandatoryAgeBorder = `${this.name}: ${textIfAllowed}`;
    }

    // mandatoryAgeBorder is now a text.
    console.log(mandatoryAgeBorder);
});

// Console will read "Is not allowed to drink beer"
police.fireEvent("check", 21, "May enjoy having a bottle of beer", "Is not allowed to drink beer");
// Console wille read "May enjoy having a bottle of beer"
police.fireEvent("check", 16, "May enjoy having a bottle of beer", "Is not allowed to drink beer");
```

## Get return values of all invocated callback functions

> You can also work with callback functions which return something.
> The function fireEventReturn can help here.
> Beware the return values will be in a map. The keys are the references to the listeners
> The values are lists of returned values of the respective listeners

**Example of working with returned values of callback functions**:

```javascript
const isMature = function() {return this.age >= 18};

const max = new Person("Max", 10);
// Serverral functions like addEventHandler can be used for the channing syntax
max.addEventHandler("absorb", max.toString).addEventHandler("absorb", isMature);
const flo = new Person("Flo", 12);
flo.addEventHandler("absorb", flo.toString).addEventHandler("absorb", isMature);
const anna = new Person("Anna", 45);
anna.addEventHandler("absorb", anna.toString).addEventHandler("absorb", isMature);

const allNamesInMap = max.fireEventReturn("absorb");

// Print the return results
const printData = (returnResults) => {
    // returnResult[0] = this.toString() , returnResult[1] = this.age >= 18
    const commentAboutAge = returnResults[1] === true ? "Is mature" : "Is not mature";
    console.log(`${returnResults[0]}, (${commentAboutAge})`);
}

// For the return results you get a map. A key is a reference to the  listener.
// A key maps to the list for the return values of invocated callback functions of the
// listeners. So the key (reference to the instance max) maps to the return values of the
// callback functions attached to max as instance.
printData(allNamesInMap.get(max)); // Max with the age of 10, (Is not mature)
printData(allNamesInMap.get(flo)); // Flo with the age of 12, (Is not mature)
printData(allNamesInMap.get(anna)); // Anna with the age of 45, (Is mature)
```

## Fire an event with an object which does not inherit from GeneralEventTarget

Sometimes you want to fire an event but an instance is not part of the
this event system like a dom element in browser environment. There are
functions with the postfix "Out" to help here. This function needs an additional parameter. This parameter is the reference to the object firing the event. This functions are invocated directly by the class itself like "GeneralTargetEvent.fireEventOut(objFromOutside, "event")".
Example below show how to.

```javascript
const person = new Person("Flo", 21);

person.addEventHandler("from outside", function (event) {
    // event.publisher.tagName = div.
    console.log(`An ${event.publisher.tagName} element triggered me !`);
});

// A div element does not extend the class GeneralEventTarget
// So it fires from outside the event system.
const objFromOutside = document.createElement("div");
GeneralEventTarget.fireEventOut(objFromOutside, "from outside");
```

**Note**:

> if you want to get the return results even if you fire an event with an object form outside
> then use "fireEventReturnOut". Object from outside the event system are not meant to be
> introduced as listeners

