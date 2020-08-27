import { 
    GeneralEventTarget 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {



const obj = {name: "Hello", id: 2};

const person = new TestPerson("Flo");


person.addEventHandler("click", (e) => {
    console.log(`e.publisher.name: ${e.publisher.name}`);
    return true;
}).addEventHandler("click", (e) => {
    console.log(`e.publisher.name: ${e.publisher.name}`);
    return true;
})

console.log(GeneralEventTarget.fireEventReturnOut(obj, "click"));




function click() {
    console.log("Hello from click");
}

function press() {
    console.log("Hello from press");
}

});

