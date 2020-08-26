import { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
}  from "./module/GeneralEventTarget.js";

import { TestPerson } from "./module/TestPerson.js"


window.addEventListener("DOMContentLoaded",() => {

let name = (function() {
    let name = "";

    return function(newName)  {
        if (newName !== null && typeof newName === "string") {
            name = newName;
        }
        return name;
    }
})();

console.log(name());

});

