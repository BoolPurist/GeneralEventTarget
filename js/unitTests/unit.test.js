"use strict";
// @ts-check
const { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
} = require("../module/GeneralEventTarget.js");

const { Test, TestPerson } = require("../module/TestPerson.js");

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

    describe(
        `
        Testing class GeneralEventTarget 
        `, () => {
            

            test(
                `
                Testing addEventHandler and fireEvent  
                `, () => {
                    let person = new TestPerson(3, "Flo");

                    person.addEventHandler("click", () => {
                        return true;
                    });


                }
            );


            

        }
    );

}
);