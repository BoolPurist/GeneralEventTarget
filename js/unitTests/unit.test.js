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

describe(
    `
    Testing Function addEventHandler
    `,
    () => {
        beforeEach(() => {
            GeneralEventTarget.clearAll();
            TestPerson.id = 0;
        })
        
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

describe(
    `
    Testing function fireEvent
    `, () => {
        
    }
)

});



