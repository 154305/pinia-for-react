import {useReactive} from "./index";
import {useMemo} from "react";

export const defineSimpleStore = <T extends object>(defaultValue: T) => () => useReactive<T>(defaultValue);

export const defineStore = <T extends object>(options: {
    state: T | (() => T),
    actions?: Record<string, Function>,
}) => {

    const getState = () => (options.state instanceof Function ? options.state() : options.state) || {};

    const initialState = JSON.parse(JSON.stringify(getState()));

    const useStore = defineSimpleStore<T>(getState());

    return () => {

        const state = useStore();

        return useMemo(() => {

            const defaultActions = {
                $reset() {
                    Object.keys(state).forEach((key) => state[key]);
                    Object.assign(state, initialState)
                },
                $patch(data) {
                    Object.assign(state, data)
                },
                $state: state
            }

            const defaultActionsKeys = Object.keys(defaultActions).concat(Object.keys(options?.actions || {}))

            const context = {
                state,
                ...options.actions,
                ...defaultActions
            }

            const proxyThisContext = new Proxy({}, {
                get(target, key) {
                    if (defaultActionsKeys.includes(key as string)) {
                        console.log(defaultActionsKeys)
                        return context[key].bind(context)
                    }
                    console.log(state[key])
                    return state[key]
                },
                set(target, key, value) {
                    if (defaultActionsKeys.includes(key as string)) {
                        return false
                    }
                    state[key] = value;
                    return true;
                },
                deleteProperty(target, key) {
                    if (defaultActionsKeys.includes(key as string)) {
                        return false
                    }
                    delete state[key];
                    return true;
                }
            })

            return proxyThisContext

        }, [])
    }
}
