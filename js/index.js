import { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {

let eventTarget = new GeneralEventTarget();
const eventType = "click";

const person = new TestPerson(2, "Flo");

const person2 = new TestPerson(3, "Max");
person.addEventHandler(eventType, (eventSource) => {
    return "a";

    
});

console.log(person2.fireEvent(eventType, true, "Hello"));

function Hello() {
    console.log("Hello from here", );
}

});

