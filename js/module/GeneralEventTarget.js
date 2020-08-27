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
     * @returns {*} returns itself for channing 
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string or the parameter callbackFunction is not a function
     */
    addEventHandler(eventType, callbackFunction) {

        throwForInValidEventType(eventType);

        GeneralEventTarget._throwForInValidCallBackFunction(callbackFunction);

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
        
        return this;
    }
    /**
     * Removes the specified callback function under the given event type for
     * this listener if it was added before
     * 
     * @param {!string} eventType 
     * @param {!Function} callbackFunction
     * @returns {*} returns instance self for channing
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string or the parameter callbackFunction is not a function 
     */
    removeEventHandler(eventType, callbackFunction) {
        throwForInValidEventType(eventType);
        GeneralEventTarget._throwForInValidCallBackFunction(callbackFunction);

        const listeners = GeneralEventTarget._eventPool.get(eventType);

        if (typeof listeners !== "undefined") {

            const callbackFunctionsList = listeners.get(this);

            if (typeof callbackFunctionsList !== "undefined") {

                const indexForRemoval = callbackFunctionsList.indexOf(callbackFunction);
                
                if (indexForRemoval !== -1) {
                    callbackFunctionsList.splice(indexForRemoval, 1);
                } 

            }
        }

        return this;
    }
    /**
     * 
     * 
     * @param {!string} eventType - Under which type of event all callback
     * functions for this listeners should be removed 
     * @returns {*} returns itself for channing 
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string    
     */
    removeFormEvent(eventType) {
        throwForInValidEventType(eventType);

        const listeners = GeneralEventTarget._eventPool.get(eventType);

        if (typeof listeners !== "undefined") {
            listeners.delete(this);
        }

        return this;
    }


    /**
     * Fires an event causing execution of all callback functions of the objects
     * as the listeners for this event type. Every invoked callback function is 
     * provided with an immutable general event object as one argument. 
     * @param {!string} eventType - type of fired event which causes the 
     * execution of the attached callbacktion 
     * @param  {...any} [argsCallbackFunction] - <optional> parameters for a callback function
     * to access through the event object
     * @returns {*} returns itself for channing
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string 
     */
    fireEvent(eventType, ...argsCallbackFunction) {
        throwForInValidEventType(eventType);
        this._triggerEvent(eventType, false, argsCallbackFunction);
        return this;        
    }

    /**
     * Fires an event causing execution of all callback functions of the objects
     * as the listeners for this event type. Every invoked callback function is 
     * provided with an immutable general event object as one argument. 
     * It also returns a map for inspect the return values of the callback function invocation.
     * 
     * @param {!string} eventType - type of fired event which causes the 
     * execution of the attached callback functions to all listeners of the event type 
     * @param  {...any} [argsCallbackFunction] - (optional) parameters for a callback function
     * to access through the event object
     * @returns {?Map<object,Array<any>>} - It returns null if there is no listener for 
     * the fired event . 
     * It returns a map with keys as references to the listeners which reacted to the fired event. A key
     * maps to a list of the return values of the executed callback function of the respective listener.
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string 
     */
    fireEventReturn(eventType, ...argsCallbackFunction) {
        throwForInValidEventType(eventType);
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
            // To prevent bugs in case some callback function would try to change the object           
            Object.freeze(eventObj);
            // Is it desired return a map for the return values of the callback function
            if (returnCallbackData === false) {
                for (const [listener, callbackFunctionList] of listeners) {
                    callbackFunctionList.forEach(callbackFunction => {                            
                            // Call invocation for enabling the use of this keyword to the 
                            // listener itself in a callback function
                            callbackFunction.call(listener, eventObj);                    
                        }
                    );                                           
                }
    
                // there are no return values desired
                return null;
            } else {
                // returned the object which fires the event
                let returnResults = new Map();
                                
                for (const [listener, callbackFunctionList] of listeners) {
                    // list of the return values of callback function of a single listener
                    let resultList = [];
                    returnResults.set(listener, resultList);
                    callbackFunctionList.forEach( 
                        (callbackFunction) => {
                            resultList.push(
                                callbackFunction.call(listener, eventObj)
                            );
                        }
                    );                                           
                }

                // Return values
                return returnResults;
            }                 
        } else return null;
        // No matching event type found for the fired event 
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
     * Removes an event type so all callback functions attached to this
     * event are now forgotten
     * 
     * @param {!string} eventType
     * @returns {!boolean} true if the an event type was deleted 
     * or false if it was not there in the first place
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string 
     */
    static clearEvent(eventType) {
        throwForInValidEventType(eventType)
        return GeneralEventTarget._eventPool.delete(eventType);
    }

    /**
     * Takes all event types out of the system.
     * So no listeners are registered anymore.
     * 
     * @static 
     * @returns {void}
     */
    static clearAll() {
        GeneralEventTarget._eventPool.clear();
    }

    /**
     * Tells if an event type was already introduced
     * 
     * @param {!string} eventType - type of an event
     * @returns {!boolean} - true if the event type has listeners
     * false if the event type has not listeners yet
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string       
     */
    static hasEventTyp(eventType) {
        throwForInValidEventType(eventType);
        return GeneralEventTarget._eventPool.has(eventType);
    }

    /**
     * @readonly
     * @type {IterableIterator<?string>} - yields all introduced event types
     */
    static get eventTypes() {
        return GeneralEventTarget._eventPool.keys();
    }

    /**
     * Gets all event types which listeners listen to.
     * 
     * @param {!string} eventType - type of events the listeners reacts to
     * @returns {Iterator<!string>} yields the all introduced event types
     * @throws {TypeError} Throws if the parameter eventType is 
     * not a non-empty string 
     */
    static getListeners(eventType) {
        throwForInValidEventType(eventType);         
        const listeners = GeneralEventTarget._eventPool.get(eventType);

        if (typeof listeners === "undefined" ) return null;
        else return listeners.keys();
        
    }

    // Used in functions to validate a callback function as parameter
    static _throwForInValidCallBackFunction(callbackFunction) {
        let desiredType = "function";
        if (callbackFunction === null || typeof callbackFunction !== desiredType) throw TypeError(
            `Paramter callbackFunction must be type "${desiredType}"`
        );
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
        this.eventType = eventType
        /**
         * reference to the object which fired the event
         * 
         * @type {!object}
         */
        this.publisher = publisher; 
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

function throwForInValidEventType(eventType) {
    let desiredType = "string";

    if (
        eventType === null || 
        typeof eventType !== desiredType ||
         eventType === ""
        ) {
        throw TypeError(
            `Parameter eventType must be of type "${desiredType} and not empty" `
        );
    }
}




export  { 
    GeneralEventTarget
};