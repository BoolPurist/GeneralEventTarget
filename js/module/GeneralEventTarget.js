// @ts-check

class GeneralEvent {

    /**
     * 
     * @param {!object} publisher 
     * @param {?Array<any>} args 
     */
    constructor(publisher, args=null) {        
        /**
         * @type {!object}
         */
        this.publisher = publisher;
        /**
         * @type {?string}
         */
        this.dataType = GeneralEvent.getDataType(this.publisher);
        /**
         * @type {Array<any>}
         */
    
        this.args = args;
        console.log(args);
        /**
         * @type {!boolean}
         */
        this.hasArgs = this.args !== null && args.length !== 0;
        /**
         * @type {?CallbackReport}
         */
        this.eventResult = null;
    }

    /**
     * 
     * @param {any} publisher
     * @returns {?string} 
     */
    static getDataType(publisher) {
        if (publisher === null) return publisher;
        const primitiveType = typeof publisher;
        if (primitiveType !== "object") return primitiveType;
        else return publisher.constructor.name;
    }
}

class CallbackReport {
    
    /**
     * 
     * @param {object} listeners
     * @param {?Array<any>} [returnValues=null]
     */
    constructor(listeners, returnValues = null) {
        /**
         * @type {object}
         */
        this._listeners = listeners;
        /**
         * @type {?Array<any>}
         */
        this._returnValues = returnValues;
        /**
         * @type {!number}
         */
        this._invocations = returnValues === null ? 0 : returnValues.length;
    }
}

class CallbackInvocation {
    
    /**
     * 
     * @param {!object} listener 
     * @param {!Function} callbackFunction 
     */
    constructor (listener, callbackFunction) {
        /**
         * @type {!object}
         */
        this.listener = listener;
        /**
         * @type {!Function}
         */
        this.callbackFunction = callbackFunction;
    }
}

class GeneralEventTarget {

    constructor() {

    }

    /**
     * 
     * @param {!string} eventType 
     * @param {!Function} callbackFunction 
     * @returns {void}  
     */
    addEventHandler(eventType, callbackFunction) {
        if (GeneralEventTarget.prototype._eventPool.has(eventType) === false) {
            
            const newInvocation = new CallbackInvocation(
                this, callbackFunction
            );

            let newEventList = [newInvocation];
            GeneralEventTarget.prototype._eventPool.set(eventType, newEventList);

        } else {
            const listeners = GeneralEventTarget.prototype._eventPool.get(eventType);
            
            const isAlreadyIn = listeners.some(element => 
                element.listener === this && 
                element.callbackFunction === callbackFunction  
            );

            if (isAlreadyIn === false) listeners.push(
                new CallbackInvocation(
                    this, callbackFunction
                )
            )

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
     * 
     * @param {!string} eventType 
     * @param {!boolean} [returnCallbackData=false] 
     * @param  {...any} [argsCallbackFunction]
     * @returns {?CallbackReport} 
     */
    fireEvent(eventType, returnCallbackData = false, ...argsCallbackFunction) {
        if (GeneralEventTarget.prototype._eventPool.has(eventType) === true) {

            const listeners = GeneralEventTarget.prototype._eventPool
            .get(eventType);
            
            console.log();
            
            let event = null;

            if (argsCallbackFunction.length === 0) {
                event = new GeneralEvent(this);
            } else {
                event = new GeneralEvent(this, argsCallbackFunction)
            }
            let callbackReport = null;

            if (returnCallbackData === true) {                
                let returnValues = listeners.map(
                    element => element.callbackFunction
                    .call(element.listener, event)                
                );
                let referencesOfListeners = listeners.map(
                    element => element.listener
                );
                
                callbackReport = new CallbackReport(
                    referencesOfListeners, returnValues
                );

            }
            else {
                listeners.forEach(element => {
                    element.callbackFunction.call(element.listener, event);                
                });
            }

            

            return callbackReport;
         

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
     * @returns {void}
     */
    static clearEvent(eventType) {

    }

    /**
     * @returns {void}
     */
    static clearAllEvents() {

    }

    /**
     * @readonly
     * @type {IterableIterator}
     */
    static get eventTypes() {
        return GeneralEventTarget.prototype._eventPool.keys();
    }

    /**
     * 
     * @param {!string} eventType
     */
    static getListeners(eventType) {

    }

    
}

/**
 * @type {Map<!string,Array<!CallbackInvocation>>}
 */
GeneralEventTarget.prototype._eventPool = new Map();





export  { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
};