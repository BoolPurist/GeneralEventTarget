import { 
    GeneralEventTarget 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {

const person = new TestPerson("Florian");

person.addEventHandler("click", click);
person.addEventHandler("click", press);
const any = () => {
    console.log("Hello from any");
};
person.addEventHandler("click", any).removeEventHandler("click", any).fireEvent("click");


function click() {
    console.log("Hello from click");
}

function press() {
    console.log("Hello from press");
}

});

