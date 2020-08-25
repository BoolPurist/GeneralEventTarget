// @ts-check

import { GeneralEventTarget } from "./GeneralEventTarget.js";

class TestPerson extends GeneralEventTarget {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }
}

export { TestPerson };