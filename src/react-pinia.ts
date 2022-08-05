//缓存全局State
import {useCallback, useEffect, useState} from "react";

//全局缓存state
const STATE = {};

//缓存依赖收集回调
const CALLBACKS = {} as Record<string, Set<Function>>

const uuid = () => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  const uuidStr = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuidStr;
};

//公共actions
type CommonActions<Id extends string, S extends object> = {
  $reset: () => void;
  $patch: (obj: Partial<S>) => void;
  $getStoreState: (callback?: Function) => void;
  $setStoreState: (obj: S) => void;
  $getStoreId: () => Id;
}

interface DefineStoreOptions<Id extends string, S extends object = {}, A extends object = {}> {
  //store唯一id，必须是唯一，可以不传，不传的话就会是uuid
  storeId?: Id;
  //初始化状态树
  store: () => S;
  //actions
  actions?: A & ThisType<A & CommonActions<Id, S>>;
}

type DefineStoreReturn<Id extends string, S extends object = {}, A extends object = {}> = A & ThisType<A & CommonActions<Id, S>> & CommonActions<Id, S> & { useStore: () => [S, A & ThisType<A> & CommonActions<Id, S>] }

export function defineStore<Id extends string, S extends object = {}, A extends object = {}>(options: DefineStoreOptions<Id, S, A>): DefineStoreReturn<Id, S, A>;

export function defineStore(options) {

  //storeId唯一标识
  const storeId = options.storeId || uuid();

  //重置
  const $reset = () => {
    $setStoreState(options.store?.() || {})
  }

  //更改局部的值
  const $patch = (patchState: object) => {
    if (typeof patchState == "object" && Object.keys(patchState).length) {
      $setStoreState({
        ...$getStoreState(),
        ...patchState
      })
    }
  }

  //获取最新的state
  const $getStoreState = (callback?: Function) => {
    //有回调则收集依赖
    if (callback) {
      let set = CALLBACKS[storeId]
      if (!set) {
        set = new Set();
        CALLBACKS[storeId] = set;
      }
      set.add(callback)
    }
    return STATE[storeId];
  }

  //设置全量state
  const $setStoreState = (value) => {
    //比较即将设置的值和已经缓存的值 相同不做处理
    if (value === CALLBACKS[storeId]) {
      return
    }
    STATE[storeId] = value;
    CALLBACKS[storeId]?.forEach(func => func())
  }

  //获取storeId
  const $getStoreId = () => {
    return storeId;
  }

  //初始化
  $reset()

  //actions
  const actions = {
    $reset,
    $patch,
    $getStoreState,
    $setStoreState,
    $getStoreId,
    ...(options?.actions || {})
  }

  return {
    ...actions,
    useStore() {
      const [_, setState] = useState(uuid());

      const update = useCallback(() => setState(uuid()), []);

      useEffect(() => () => {
        CALLBACKS[storeId].delete(update)
      }, [])

      return [
        $getStoreState(update),
        actions,
      ]
    }
  }
}
