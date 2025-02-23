import { useEffect, useState } from 'react';

// create the state here so every file that consumes this will be able to share the same set of data
let globalState = {};
let listeners = [];
let actions = {};

// a custom hook that simulate redux store
export const useStore = (shouldListen = true) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = { ...globalState, ...newState };

        for (const listener of listeners) {
            listener(globalState);
        }
    };

    useEffect(() => {
        if(shouldListen) {
            listeners.push(setState);
        }

        return () => {
            if(shouldListen){
                listeners = listeners.filter(li => li !== setState);
            }
        }
    }, [setState, shouldListen]); //actually setState wont be changed so no need to list in dependency

    return [globalState, dispatch]
}

export const initStore = (userActions, initialState) => {
    if (initialState) {
        globalState = { ...globalState, ...initialState };
    }
    actions = { ...actions, ...userActions };
}