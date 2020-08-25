import * as events from "./module/GeneralEventTarget.js";

window.addEventListener("DOMContentLoaded",() => {

const generalEvent = new events.GeneralEvent(new Person("flo"), null);
console.log(generalEvent.target);

});

function Person(name="person") {
    this.name = name;
}