// @ts-check

import { GeneralEventTarget } from "./GeneralEventTarget.js";

class TestPerson extends GeneralEventTarget {
    constructor(name) {
        super();
        TestPerson.id++;
        this.id = TestPerson.id;
        this.name = name;
    }

    

    toString() {
        return `Id: ${this.id}, Name: ${this.name}`;
    }
}

TestPerson.id = 0;

export { TestPerson };