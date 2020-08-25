import { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {

    const persons = [
        new TestPerson("Flo"),
        new TestPerson("Max"),
        new TestPerson("Max"),
        new TestPerson("Mix"),
        new TestPerson("Yxx"),
        new TestPerson("Max"),
        new TestPerson("Max"),
        new TestPerson("Macc"),
        new TestPerson("Max"),
        new TestPerson("Max"),
    ];

    for (let i = 0; i < 3; i++) {
        persons[i].addEventHandler("click", click);
    }
    for (let i = 4; i < 6; i++) {
        persons[i].addEventHandler("press", press);
    }
    for (let i = 6; i < persons.length; i++) {
        persons[i].addEventHandler("focus", focus);
    }

    

    const eventPool = GeneralEventTarget._eventPool;
    GeneralEventTarget.clearAll();
    console.log(eventPool);
    function click() {
        return "click";
    }
    function press() {
        return "press";
    }
    function focus() {
        return "focus";
    }

});

