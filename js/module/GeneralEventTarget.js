// @ts-check

class GeneralEvent {

    /**
     * 
     * @param {!object} target 
     * @param {...any} args 
     */
    constructor(target, ...args) {        
        /**
         * @type {!object}
         */
        this.target = target;
        /**
         * @type {?string}
         */
        this.dataType = GeneralEvent.getDataType(this.target);
        /**
         * @type {Array<any>}
         */
        this.args = args;
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
     * @param {any} target
     * @returns {?string} 
     */
    static getDataType(target) {
        if (target === null) return target;
        const primitiveType = typeof target;
        if (primitiveType !== "object") return primitiveType;
        else return target.constructor.name;
    }
}

class CallbackReport {
    
    /**
     * 
     * @param {object} listener 
     * @param {?Array<any>} [returnValues=null]
     */
    constructor(listener, returnValues = null) {
        /**
         * @type {object}
         */
        this._listener = listener;
        /**
         * @type {?Array<any>}
         */
        this._returnValues = returnValues;
    }
}

class callbackInvocation {
    
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
     * @param {!boolean} [returnsProcessedEvent=false] 
     * @param  {...any} [argsCallbackFunction]
     * @returns {void|GeneralEvent} 
     */
    fireEvent(eventType, returnsProcessedEvent = false, ...argsCallbackFunction) {

    }

    /**
     * 
     * @param {!object} target 
     * @param {!string} eventType 
     * @param {!boolean} [returnsProcessedEvent=false] 
     * @param  {...any} [argsCallbackFunction]
     * @returns {void|GeneralEvent} 
     */
    static fireEventOut(target, eventType, returnsProcessedEvent = false, ...argsCallbackFunction) {

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
 * @type {Map<!string,!callbackInvocation>}
 */
GeneralEventTarget.prototype._eventPool = new Map();





export  { GeneralEventTarget, GeneralEvent, CallbackReport };