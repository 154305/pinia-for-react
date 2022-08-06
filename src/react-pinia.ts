//缓存全局State
import {useCallback, useEffect, useState} from "react";

//全局缓存state
const STATE = {};

//缓存依赖收集回调
const CALLBACKS = {} as Record<string, Set<Function>>

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

//公共actions
type CommonActions<Id extends string, S extends object> = {
    $reset: () => void;
    $patch: (obj: Partial<S>) => void;
    $getState: (callback?: Function) => void;
    $setState: (obj: S) => void;
    $getId: () => Id;
}

interface DefineStoreOptions<Id extends string, S extends object = {}, A extends object = {}> {
    //store唯一id，必须是唯一，可以不传，不传的话就会是uuid
    id?: Id;
    //初始化状态树
    state: () => S;
    //actions
    actions?: A & ThisType<A & CommonActions<Id, S>>;
}

type DefineStoreReturn<Id extends string, S extends object = {}, A extends object = {}> = A & ThisType<A & CommonActions<Id, S>> & CommonActions<Id, S> & { useStore: () => [S, A & ThisType<A> & CommonActions<Id, S>] }

export function defineStore<Id extends string, S extends object = {}, A extends object = {}>(options: DefineStoreOptions<Id, S, A>): DefineStoreReturn<Id, S, A>;

export function defineStore(options) {

    //storeId唯一标识
    const id = options.id || uuid();

    //重置
    const $reset = () => {
        $setState(options.state?.() || {})
    }

    //更改局部的值
    const $patch = (patchState: object) => {
        if (typeof patchState == "object" && Object.keys(patchState).length) {
            $setState({
                ...$getState(),
                ...patchState
            })
        }
    }

    //获取最新的state
    const $getState = (callback?: Function) => {
        //有回调则收集依赖
        if (callback) {
            let set = CALLBACKS[id]
            if (!set) {
                set = new Set();
                CALLBACKS[id] = set;
            }
            set.add(callback)
        }
        return STATE[id];
    }

    //设置全量state
    const $setState = (value) => {
        if (!value||typeof value != 'object'){
            return console.warn('[pinia-for-react]$setStoreState只能接受object类型')
        }
        //比较即将设置的值和已经缓存的值 相同不做处理
        if (value === CALLBACKS[id]) {
            return;
        }
        STATE[id] = value;
        CALLBACKS[id]?.forEach(func => func())
    }

    //获取storeId
    const $getId = () => {
        return id;
    }

    //初始化
    $reset()

    //actions
    const actions = {
        $reset,
        $patch,
        $getState,
        $setState,
        $getId,
        ...(options?.actions || {})
    }

    return {
        ...actions,
        useStore() {
            const [_, setState] = useState(uuid());

            const update = useCallback(() => setState(uuid()), []);

            useEffect(() => () => {
                CALLBACKS[id].delete(update)
            }, [])

            return [
                $getState(update),
                actions,
            ]
        }
    }
}
