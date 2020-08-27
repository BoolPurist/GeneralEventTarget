import { 
    GeneralEventTarget 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {



const obj = {name: "Hello", id: 2};

const person = new TestPerson("Flo");
const person2 = new TestPerson("Max");
person2.addEventHandler("click", () => {});
person2.addEventHandler("focus", () => {});

person.addEventHandler("click", (e) => {
    let [word1, word2] = e.args;
    word1 = "Bye"
    console.log(word1 + word2);
    console.log(`e.publisher.name: ${e.publisher.name}`);
    return true;
}).addEventHandler("click", (e) => {
    console.log(`e.publisher.name: ${e.publisher.name}`);
    return true;
})

console.log(GeneralEventTarget._eventPool);

console.log(GeneralEventTarget.fireEventReturnOut(obj, "click", "Hello", " World"));




function click() {
    console.log("Hello from click");
}

function press() {
    console.log("Hello from press");
}

});

