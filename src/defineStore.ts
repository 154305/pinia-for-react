import {useCallback, useEffect, useState} from "react";
import {v4 as uuid} from "uuid"
import {functionMapBindContext} from "./utils";
import {DEPS, STATE} from "./cache";
import {debounce} from "lodash-es";

//公共actions
interface CommonActions<Id extends string, S extends object = {}> {
    $reset: () => void;
    $patch: (obj: Partial<S>) => void;
    $getState: (callback?: Function) => void;
    $setState: (obj: S) => void;
    $getId: () => Id;
    $forceUpdate: () => void;
}

type ActionContext<Id extends string, S extends object, A extends {}> = A & ThisType<CommonActions<Id, S> & A>

interface DefineStoreOptions<Id extends string, S extends object = {}, A extends object = {}> {
    //store唯一id，必须是唯一，可以不传，不传的话就会是uuid
    id?: Id;
    //初始化状态树
    state: () => S;
    //actions
    actions?: ActionContext<Id, S, A>;
}

type HookType<Id extends string, S extends object = {}, A extends object = {}> = CommonActions<Id, S> & ActionContext<Id, S, A> & {
    useStore: () => [S, ActionContext<Id, S, A>]
}

type DefineStoreReturn<Id extends string, S extends object = {}, A extends object = {}> = { (): [S, CommonActions<Id, S> & ActionContext<Id, S, A>] } & HookType<Id, S, A>

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


    //延迟更新
    const delayUpdate = debounce(() => $forceUpdate(), 20)

    //强制刷新
    const $forceUpdate = () => {
        DEPS[id]?.forEach(func => func());
    }

    //获取最新的state
    const $getState = (dep?: Function) => {
        //有回调则收集依赖
        if (dep) {
            DEPS[id] = DEPS[id] || new Set();
            DEPS[id].add(dep);
        }
        return STATE[id];
    }

    //设置全量state
    const $setState = (value) => {
        if (!value || typeof value != 'object') {
            return console.warn('[pinia-for-react]$setStoreState只能接受object类型')
        }
        //比较即将设置的值和已经缓存的值 相同不做处理
        if (value === STATE[id]) {
            return;
        }
        STATE[id] = value;
        delayUpdate()
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
        $forceUpdate
    }
    //合并action
    Object.assign(actions, functionMapBindContext(actions, options.actions || {}))

    //hook回调
    function useStore() {

        const [_, triggerUpdate] = useState(uuid());

        const dep = useCallback(() => triggerUpdate(uuid()), []);

        useEffect(() => () => {
            DEPS[id]?.delete(dep)
        }, [])

        return [
            $getState(dep),
            actions,
        ]
    }

    Object.assign(useStore, {
        ...actions,
        useStore
    })

    return useStore;
}
