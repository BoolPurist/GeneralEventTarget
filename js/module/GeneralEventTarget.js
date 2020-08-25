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
         * @type {!object}
         */ 
        this.listener = null;   
        /**
         * @type {Array<any>}
         */
        this.args = args;        
        /**
         * @type {!boolean}
         */
        this.hasArgs = this.args !== null && args.length !== 0;
        /**
         * @type {Array<any>}
         */
        this.eventResults = null;
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

        let listeners = GeneralEventTarget._eventPool.get(eventType);
        
        if (typeof listeners === "undefined") {
            GeneralEventTarget._eventPool.set(
                eventType, new Map().set(this, [callbackFunction])
            )
        } else {            
            let callbackFunctionList = listeners.get(this);

            if (typeof callbackFunctionList === "undefined") {
                listeners.set(this, [callbackFunction]);
            } else if (
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
     * 
     * @param {!string} eventType 
     * @param  {...any} argsCallbackFunction 
     * @returns {void}
     */
    fireEvent(eventType, ...argsCallbackFunction) {
        this._triggerEvent(eventType, false, argsCallbackFunction);        
    }

    /**
     * 
     * @param {!string} eventType 
     * @param  {...any} argsCallbackFunction 
     * @returns {?Map<object,Array<any>>}
     */
    fireEventReturn(eventType, ...argsCallbackFunction) {
        return this._triggerEvent(eventType, true, argsCallbackFunction);
    }

    /**
     * 
     * @param {!string} eventType 
     * @param {!boolean} [returnCallbackData=false] 
     * @param  {Array<any>} [argsCallbackFunction]
     * @returns {?Map<object,any>} 
     */
    _triggerEvent(eventType, returnCallbackData = false, argsCallbackFunction) {
        let listeners = GeneralEventTarget._eventPool.get(eventType);
        
        if (typeof listeners !== "undefined") {

            const eventObj = new GeneralEvent(this, argsCallbackFunction);

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
     * @returns {void}
     */
    static clearEvent(eventType) {

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





export  { 
    GeneralEventTarget, GeneralEvent, CallbackReport, CallbackInvocation 
};