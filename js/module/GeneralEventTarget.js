// @ts-check

class GeneralEventTarget {

    constructor() {

    }

    /**
     * Attaches this instance as a listener with a callback function
     * into the event system
     * 
     * @param {!string} eventType - type of fired event which causes the 
     * execution of the attached callbacktion 
     * @param {!Function} callbackFunction - function to be executed when an event 
     * with the specified type was fired
     * @returns {void} 
     */
    addEventHandler(eventType, callbackFunction) {

        // Map with keys of object references and values as list of functions
        let listeners = GeneralEventTarget._eventPool.get(eventType);
        
        if (typeof listeners === "undefined") {
            // New event type is introduced with its first listener which
            // has 1 callback function
            GeneralEventTarget._eventPool.set(
                eventType, new Map().set(this, [callbackFunction])
            )
        } else {            
            // list of callback functions belonging to a specific listener 
            let callbackFunctionList = listeners.get(this);

            // while the event type is already introduced there is chance that
            // the listener is not yet.
            if (typeof callbackFunctionList === "undefined") {
                listeners.set(this, [callbackFunction]);
            } else if (
                // checking if the callback function to be attached 
                // is already there 
                callbackFunctionList.some(
                    oneCallbackFunction => 
                    oneCallbackFunction === callbackFunction
                    )    === false
            ) {
                callbackFunctionList.push(callbackFunction);
            }
        }        
    }
    /**
     * 
     * @param {!string} eventType 
     * @param {!Function} callbackFunction
     * @returns {void} 
     */
    removeEventHandler(eventType, callbackFunction) {

    }
    /**
     * 
     * @param {!string} eventType  
     * @returns {void}     
     */
    removeEvent(eventType) {

    }


    /**
     * Fires an event causing execution of all callback functions of the objects
     * as the listeners for this event type
     * @param {!string} eventType - type of fired event which causes the 
     * execution of the attached callbacktion 
     * @param  {...any} argsCallbackFunction  parameters for a callback function
     * to access through the event object
     * @returns {void}
     */
    fireEvent(eventType, ...argsCallbackFunction) {
        this._triggerEvent(eventType, false, argsCallbackFunction);        
    }

    /**
     * Fires an event causing execution of all callback functions of the objects
     * as the listeners for this event type. It also returns a map for inspect the 
     * return values of the callback function invocation.
     * 
     * @param {!string} eventType - type of fired event which causes the 
     * execution of the attached callbacktion 
     * @param  {...any} argsCallbackFunction - parameters for a callback function
     * to access through the event object
     * @returns {?Map<object,Array<any>>} - It returns a map with keys
     * as references to the listeners which reacted to the fired event. A key
     * maps to a list of the return values of the executed callback function of
     * that listener.
     */
    fireEventReturn(eventType, ...argsCallbackFunction) {
        return this._triggerEvent(eventType, true, argsCallbackFunction);
    }

    // Fires an event with a given event type to trigger all callback functions of
    // the listeners for that type. 
    _triggerEvent(eventType, returnCallbackData = false, argsCallbackFunction) {
        let listeners = GeneralEventTarget._eventPool.get(eventType);
        
        // if the event type was not introduced by any listener so far, no need to go further
        if (typeof listeners !== "undefined") {

            // Object to given as parameter for an invocation of a callback function
            // the callback function gets certain information this way
            const eventObj = new GeneralEvent(eventType, this, argsCallbackFunction);

            if (returnCallbackData === false) {
                for (const [listener, callbackFunctionList] of listeners) {
                
                    callbackFunctionList.forEach(callbackFunction => {
                            eventObj.listener = listener;
                            callbackFunction.call(listener, eventObj);                    
                        }
                    );                                           
                }
    
                return null;
            } else {
                let returnResults = new Map();
                                
                for (const [listener, callbackFunctionList] of listeners) {
                    let resultList = [];
                    returnResults.set(listener, resultList);
                    callbackFunctionList.forEach( 
                        (callbackFunction) => {
                            eventObj.listener = listener;
                            resultList.push(
                                callbackFunction.call(listener, eventObj)
                            );
                        }
                    );                                           
                }

                return returnResults;
            }

                 
        } else return null; 
    }

    /**
     * 
     * @param {!object} publisher 
     * @param {!string} eventType 
     * @param {!boolean} [returnCallbackData=false] 
     * @param  {...any} [argsCallbackFunction]
     * @returns {void|GeneralEvent} 
     */
    static fireEventOut(publisher, eventType, returnCallbackData = false, ...argsCallbackFunction) {

    }

    /**
     * 
     * @param {object} eventTarget
     * @returns {void} 
     */
    static injectAsEventTarget(eventTarget) {

    }

    /**
     * @param {!string} eventType
     * @returns {!boolean}
     */
    static clearEvent(eventType) {
        return GeneralEventTarget._eventPool.delete(eventType);
    }

    /**
     * @static
     * @function
     * @returns {void}
     */
    static clearAll() {
        GeneralEventTarget._eventPool.clear();
    }

    /**
     * @readonly
     * @type {IterableIterator}
     */
    static get eventTypes() {
        return GeneralEventTarget._eventPool.keys();
    }

    /**
     * 
     * @param {!string} eventType
     */
    static getListeners(eventType) {

    }

    
}


    /**
     * @static
     * @type {Map<!string, Map<object, Array<Function> >>}
     */
    GeneralEventTarget._eventPool = new Map();

    /**
     * The type is used primarily to provide certain information for a callback function when 
     * triggered by an fired event
     */
    class GeneralEvent {

        /**
         * An instance to hold information for a callback function which can use it
         * It meant to give such an instance as parameter during invocation of a 
         * callback function
         * 
         * @param {!object} publisher - reference to the object which fired the event 
         * @param {?Array<any>} [args=null] - arguments which will be accessible for a callback function
         */
        constructor(eventType ,publisher, args=null) {        
            
            /**
             * Type of event which is fired.
             * 
             * @type {!string}
             */
            this._eventType = eventType
            /**
             * reference to the object which fired the event
             * 
             * @type {!object}
             */
            this.publisher = publisher;
            /**
             * place to store the reference to the object which attached the
             * callback function. this is useful in case the callback function 
             * is an arrow function. Arrow functions do not have an own binding for 
             * this keyword.
             * 
             * @type {!object}
             */ 
            this.listener = null;   
            /**
             * Arbitrary values for a callback function which works with arguments
             * 
             * @type {Array<any>}
             */
            this.args = args;        
            /**
             * Fast way to tell if an event has arguments attached
             * 
             * @type {!boolean}
             */
            this.hasArgs = this.args !== null && args.length !== 0;
        }
    
    
    }




export  { 
    GeneralEventTarget
};