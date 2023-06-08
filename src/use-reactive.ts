import {reactive, effect} from '@vue/reactivity'
import {useMemo} from 'react'
import {useForceUpdate} from "./util";

export const useReactive = <T extends object>(object: T) => {

    const forceUpdate = useForceUpdate();

    const state = useMemo(() => reactive(object), []);

    useMemo(() => effect(() => {
        JSON.stringify(state)
        forceUpdate()
    }), [])

    return state;
}

export default useReactive
