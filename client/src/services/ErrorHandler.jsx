import { useContext } from 'react';

import AppContext from '../context/AppContext.jsx';
import Settings from '../services/Settings.js';

export default function ErrorHandler() {
    const { 
        setErrorList, 
        errorHandlerList 
    } = useContext(AppContext);

    return (errors) => {
        //iterate through all errors with last handler, removing all those it can handle and allowing it to do so.
        //then next handler with remaining, and so on so forth.

        let remainingErrors = [], 
            handlers = errorHandlerList;
        for (let handlerIndex = handlers.length - 1; handlerIndex > -1; handlerIndex--) {
            for (let errorIndex = errors.length - 1; errorIndex > -1; errorIndex--) {
                const handler = errorHandlerList[handlerIndex];
                const error = errors[errorIndex];
                if (handler.targets.includes(error.target)) {
                    handler.handle(error);
                } else {
                    remainingErrors.push(error);
                }
            }
            errors = remainingErrors;
            remainingErrors = [];
        }

        if (Settings.debug() && errors.length > 0) {
            console.group("%cUnhandled errors;", "color: orange; font-weight: bold;");
            errors.forEach(error => {
                console.warn(`Unhandled error targetting ${error.target}.\n\t"${error.message}"`)
            });
            console.groupEnd();
        }

        setErrorList([]);
    }
}