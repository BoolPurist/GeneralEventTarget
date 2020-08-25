"use strict";
const { GeneralEventTarget, GeneralEvent, CallbackReport } = require("../module/GeneralEventTarget.js");

describe(
    `
Testing module GeneralEventTarget
`, () => {


    describe(
        `
        Testing class GeneralEvent
        `, () => {
            
            test.each([
                [null, null],
                ["number", 2],
                ["string", "word"],
                ["boolean", true],
                ["Object", {}],
                ["Array", []],
                ["CallbackReport", new CallbackReport({}, null)]
            ])(
                `
                Static method getDataType should return the 
                following data type "%s" 
                with the given value %o 
                `, (expectedDataType, actualValue) => {
                    const actualType = GeneralEvent.getDataType(actualValue);

                    expect(actualType).toBe(expectedDataType);
                }
            );


        }
    );

}
);