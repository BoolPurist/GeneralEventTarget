"use strict";
// @ts-check
const { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
} = require("../module/GeneralEventTarget.js");

const { Test, TestPerson } = require("../module/TestPerson.js");


describe(
`
Testing class GeneralEventTarget 
`, () => {

    beforeEach(() => {
        GeneralEventTarget.clearAll();
        TestPerson.id = 0;
    })

    const invalidEventTypeList = [
        null, undefined, 2, "",  function () {}, false , {}
    ];
    
    const invalidFunctionParamsList = [
        null,
        undefined,
        2,
        "Hello",
        "",                
        false,
        {}
    ];

    let obj = {
        value: null
    };

    let persons = [
        new TestPerson("Person"),
        new TestPerson("Person"),
        new TestPerson("Person"),
        new TestPerson("Person"),
        new TestPerson("Person"),
        new TestPerson("Person"),
        new TestPerson("Person"),
        new TestPerson("Person"),
    ];



    beforeEach(
        () => {
            obj.value = 0;
            
            persons = [
                new TestPerson("Person"),
                new TestPerson("Person"),
                new TestPerson("Person"),
                new TestPerson("Person"),
                new TestPerson("Person"),
                new TestPerson("Person"),
                new TestPerson("Person"),
                new TestPerson("Person"),
            ];
        }
    );

    describe(
        `
        Testing Function addEventHandler
        `,
        () => {

            // Throwing tests

            test.each(invalidEventTypeList)(
                `
                Should throw if the eventTyp is %o. 
                `, (invalidEventType) => {
                    const person = new TestPerson("Flo");
                    const actualInvocation = () => {    
                        person.addEventHandler(invalidEventType, () => {});
                    }

                    expect(actualInvocation).toThrow(TypeError);
                }
            );



            test.each(invalidFunctionParamsList)(
                `
                Should throw if the callbackFunction is %o. 
                `, (invalidCallbackFunction) => {
                    const person = new TestPerson("Flo");
                    const actualInvocation = () => {    
                        person.addEventHandler("event", invalidCallbackFunction);
                    }

                    expect(actualInvocation).toThrow(TypeError);
                }
            );

            
            
            test(
                `
                Testing for redundancy caused by addEventHandler 
                Should only have one eventType "click" with 3 listeners
                1, one has only click as callback, 2. has click and focus
                3. has only focus as callback. The input 
                is 3 instances. All listen to the "click" as event.
                1. one invokes the 3 times the same event with the same 
                callback function
                2. one attaches once a callback function click and focus
                3. one attaches twice the callback function focus
                `, 
                () => {
                    const persons = [
                        new TestPerson("Flo"),
                        new TestPerson("Max"),
                        new TestPerson("Meier"),
                    ];
                    const clickEvent = "click";
                    
                    for (let i = 0; i < 3; i++) {
                        persons[0].addEventHandler(clickEvent, click);
                    }
            
                    persons[1].addEventHandler(clickEvent, click);
                    persons[1].addEventHandler(clickEvent, focus);
            
                    for (let i = 0; i < 2; i++) {
                        persons[2].addEventHandler(clickEvent, focus);
                    }
                    const eventPool = GeneralEventTarget._eventPool; 
                    // Only one event "click" should be there
                    expect(eventPool.size).toBe(1);
                    
                    
                    const listenerPool = eventPool.get(clickEvent);
                    // The only key should be "click"
                    expect(Array.from(eventPool.keys())[0]).toBe(clickEvent);
                    const firstListener = listenerPool.get(persons[0]);
                    const secondListener = listenerPool.get(persons[1]); 
                    const thirdListener = listenerPool.get(persons[2]);
                    
                    expect(firstListener.length).toBe(1);
                    expect(firstListener[0]).toEqual(click);
                    expect(secondListener.length).toBe(2);
                    expect(secondListener[0]).toEqual(click);
                    expect(secondListener[1]).toEqual(focus);
                    expect(thirdListener[0]).toEqual(focus);
                    expect(thirdListener.length).toBe(1);
                }
            ) 
            
            test.each([
                [
                    2,
                    [
                        {
                            eventType: "click", 
                            callbackFunction: click, 
                            persons: [new TestPerson("Clicker Dude")] 
                        },
                        {
                            eventType: "press", 
                            callbackFunction: press, 
                            persons: [new TestPerson("Pressing  Dude")] 
                        }
            
                    ],
            
                ],
                [
                    3,
                    [
                        {
                            eventType: "click", 
                            callbackFunction: click, 
                            persons: [new TestPerson("Clicker Dude")] 
                        },
                        {
                            eventType: "press", 
                            callbackFunction: press, 
                            persons: [new TestPerson("Pressing  Dude")] 
                        },
                        {
                            eventType: "focus", 
                            callbackFunction: focus, 
                            persons: [new TestPerson("Focussing  Dude")] 
                        }
                        
                    ]
                ],
                [
                    1,
                    [
                        {
                            eventType: "click", 
                            callbackFunction: click, 
                            persons: [new TestPerson("Clicker Dude")] 
                        },
                        {
                            eventType: "click", 
                            callbackFunction: press, 
                            persons: [new TestPerson("Pressing  Dude")] 
                        },
                        {
                            eventType: "click", 
                            callbackFunction: focus, 
                            persons: [
                                new TestPerson("Focussing  Dude"),
                                new TestPerson("Focussing  Dude 2")
                            ] 
                        }
                        
                    ]
                ],
            ])(
                `%# Run: Should have %i eventType registered 
                via method addEventHandler  
                Should find all callback functions 
                via refereeing the even type -> listener ref -> callFunctions    
                `, 
                (expectedEventTypNumber,listToSetup) => {
            
                    listToSetup.forEach(eventHandling => {
                        const {
                            eventType, callbackFunction, persons
                        } = eventHandling;
            
                        persons.forEach(person => {
                            person.addEventHandler(eventType, callbackFunction);
                        })
                    });
            
                    listToSetup.forEach(eventHandling => {
                        const {
                            eventType, callbackFunction, persons
                        } = eventHandling;
                        
                        expect(GeneralEventTarget._eventPool.size)
                        .toBe(expectedEventTypNumber);
                        
                        const listeners = GeneralEventTarget.
                        _eventPool.get(eventType);
            
            
            
                        persons.forEach(person => {
                            expect(listeners.has(person))
                            .toBe(true);
                            
                            expect(listeners.get(person)[0]).
                            toEqual(callbackFunction);
                            
                        });
            
                    })
                }
            );
            

        });



    describe(
        `
        Testing function fireEvent
        `, () => {



            
            // Throwing test

            test.each(invalidEventTypeList)(
                `
                Should throw if the eventTyp is %o. 
                `, (invalidEventType) => {
                    const person = new TestPerson("Flo");
                    const actualInvocation = () => {    
                        person.fireEvent(invalidEventType, () => {});
                    }

                    expect(actualInvocation).toThrow(TypeError);
                }
            )


            test.each([
                [
                    40,
                    [                        
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: "click",
                            callbackFunction: () => obj.value += 10,
                        },
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: "click",
                            callbackFunction: () => obj.value += 10,
                        },
                    ]    
                ],
                [
                    30,
                    [                        
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: "click",
                            callbackFunction: changeFix,
                        },
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: null ,
                            callbackFunction: changeFix,
                        },
                        {
                            person: persons[0],
                            event: "focus",
                            fireEvent: "focus",
                            callbackFunction: changeFix,
                        },
                        {
                            person: persons[1],
                            event: "click",
                            fireEvent: null,
                            callbackFunction: changeFix,
                        },
                    ]
                ],
                [
                    10,
                    [                        
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: null,
                            callbackFunction: changeFix,
                        },
                        {
                            person: persons[1],
                            event: "click",
                            fireEvent: null ,
                            callbackFunction: changeFix,
                        },
                        {
                            person: persons[0],
                            event: "focus",
                            fireEvent: "focus",
                            callbackFunction: changeFix,
                        },
                        {
                            person: persons[1],
                            event: "click",
                            fireEvent: null,
                            callbackFunction: changeFix,
                        },
                    ]
                ],
                [
                    50,
                    [                        
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: "click",
                            args: 20,
                            callbackFunction: changeByArgue,
                        },
                        {
                            person: persons[1],
                            event: "click",
                            fireEvent: null ,
                            args: 20,
                            callbackFunction: changeByArgue,
                        },
                        {
                            person: persons[2],
                            event: "focus",
                            fireEvent: "focus",
                            args: 10,
                            callbackFunction: changeByArgue,
                        },
                    ]
                ]
            ])(
                `
                Should invoke a function which changes a object value to %i %o
                `, (expectedResult, fireEventScenarioList) => {
                    doAddingEventHandlers(fireEventScenarioList);
                    doFiring(fireEventScenarioList);
                    expect(obj.value).toBe(expectedResult);
                }
            )

         test(
            `
            Testing the this keyword in the callback function
            Should change name of a person via the callback.
            `, () => {
                let person = new TestPerson("Unchanged");

                person.addEventHandler("change", changeName)
                .fireEvent("change");

                expect(person.name).toBe("changed");

                function changeName() {
                    this.name = "changed";
                }
            })

        }
    );

    describe(
        `
        Testing function fireEventReturn
        `, () => {

            test.each(invalidEventTypeList)(
                `
                Should throw if the eventTyp is %o. 
                `, (invalidEventType) => {
                    const person = new TestPerson("Flo");
                    const actualInvocation = () => {    
                        person.fireEventReturn(invalidEventType, () => {});
                    }
        
                    expect(actualInvocation).toThrow(TypeError);
                }
            )
        
        }
    )

    describe(
        `
        Testing function hasEventTyp
        `, () => {

            test.each(invalidEventTypeList)(
                `
                Should throw Type error if the parameter "eventType" is %o
                `, (invalidEventType) => {
                    const person  = new TestPerson();
                    const actualInvocation = () => {
                        person.hasEventTyp(invalidEventType);
                    }

                    expect(actualInvocation).toThrow(TypeError);
                }
            ) 

            test(
                `
                Should return false if there is no event type in the system yet 
                `, () => {
                    const person = new TestPerson();
                    const actualReturn = GeneralEventTarget.hasEventTyp("click");
                    expect(actualReturn).toBe(false);
                }
            )

            test.each([
                [true, "click", ["click", "click", "click", null, null]],
                [false, "focus", [null, null, null, null, null]],
                [true, "press", [null, null,"press", null, null]],
                [true, "change", ["null", "change", null , null, null]],
            ])(
                `
                Should return %o for the event type "%s" for when the 
                following events are added: null means no element added.
                %p
                `, (expectedResult, eventToCheck, setUpList) => {
                    const length = 5;
                    const persons = [];

                    for (let i = 0; i < length; i++) {
                        persons.push(new TestPerson(`${i}`));

                        if (setUpList[i] !== null) {
                            persons[i].addEventHandler(setUpList[i], () => {});
                        }
                        

                    }

                    expect(GeneralEventTarget.hasEventTyp(eventToCheck))
                    .toBe(expectedResult);
                }
            );
        }
    )

    describe(
        `
        Testing function removeEventHandler
        `, () => {

            test.each(invalidEventTypeList)(
                `
                Should throw Type error if an event type as %o is not a non-empty string
                `, () => {
                    const person = new TestPerson();
                    const actualInvocation = () => {
                        person.removeEventHandler(invalidEventTypeList, () => {});
                    }

                    expect(actualInvocation).toThrow(TypeError);
                }
            );

            test.each(invalidFunctionParamsList)(
                `
                Should throw Type error if an event type as %o is not a non-empty string
                `, (invalidCallbackFunction) => {
                    const person = new TestPerson();
                    const actualInvocation = () => {
                        person.removeEventHandler("event", invalidFunctionParamsList);
                    }

                    expect(actualInvocation).toThrow(TypeError);
                }
            );

            // removeCallbackFunction is the reference to the function to be removed
            // removeEvent is the event typ key that leads to the reference to the
            // function to be removed.
            test.each([
                [
                    0, 
                    [
                        {
                            person: persons[0],
                            event: "click",
                            fireEvent: null,
                            callbackFunction: changeFix,
                            removeCallbackFunction: null,
                            removeEvent: null,
                        },
                        {
                            person: persons[0],
                            event: null,
                            fireEvent: "click",
                            callbackFunction: null,
                            removeEvent: "click",
                            removeCallbackFunction: changeFix,
                        },
                    ]
                ],
                [
                    20, 
                    [
                        {
                            person: persons[0],
                            event: "click",
                            callbackFunction: changeFix,
                            fireEvent: null,
                            removeCallbackFunction: null,
                            removeEvent: null,
                        },
                        {
                            person: persons[0],
                            event: "click",
                            callbackFunction: changeByArgue,
                            fireEvent: null,
                            removeEvent: null,
                            removeCallbackFunction: null,
                        },
                        {
                            person: persons[0],
                            event: null,
                            callbackFunction: null,
                            fireEvent: null,
                            removeEvent: "click",
                            removeCallbackFunction: changeFix,
                        },
                        {
                            person: persons[0],
                            event: null,
                            callbackFunction: null,
                            fireEvent: "click",
                            args: 20,
                            removeEvent: null,
                            removeCallbackFunction: null,
                        },
                    ]
                ],
            ])(
                `
                Should change the value to %i when events are adde and then removed.
                
                `, (expectedResult, setUpList) => {
                    doAddingEventHandlers(setUpList);
                    doRemoveEvents(setUpList);
                    doFiring(setUpList);

                    expect(obj.value).toBe(expectedResult);
                }
            )

        }
    )

    // testing function
    function doAddingEventHandlers(setUpList) {
        setUpList.forEach(setUpObj => {
            const {person, event, callbackFunction} = setUpObj;
            if (event !== null ) person.addEventHandler(event, callbackFunction);            
        })
    }
    
    function doFiring(setUpList) {
        setUpList.forEach(setUpObj => {            
            const {person ,fireEvent, args} = setUpObj;
            if (fireEvent !== null ) person.fireEvent(fireEvent, args);
        })
    }

    function doRemoveEvents(setUpList) {
        setUpList.forEach(setUpObj => {            
            const {person ,removeEvent, removeCallbackFunction} = setUpObj;
            if (removeEvent !== null ) person.removeEventHandler(
                removeEvent, removeCallbackFunction
            );
        })
    }



    function click() {
        return "click";
    }
    function press() {
        return "press";
    }
    function focus() {
        return "focus";
    }

    // test callback functions
    function changeFix() {
        obj.value += 10;
    }

    function changeByArgue(event) {
        obj.value += event.args[0]; 
    }


});



