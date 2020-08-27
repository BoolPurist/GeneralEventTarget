import { 
    GeneralEventTarget 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {

const person = new TestPerson("Florian");

person.addEventHandler("click", click);
person.addEventHandler("press", press);
person.addEventHandler("press", () => {console.log("Hello from any press")});
const any = () => {
    console.log("Hello from any");
};
person.removeFormEvent("click").fireEvent("press").fireEvent("click");


function click() {
    console.log("Hello from click");
}

function press() {
    console.log("Hello from press");
}

});

