import {useCallback, useEffect, useState} from "react";

//缓存全局State
const STATE = {};

//缓存依赖收集回调
const CALLBACKS = {} as Record<any, Set<Function>>

const uuid = () => Math.random() + new Date().getTime();

export const useAtom = (a) => {
  const [_, setState] = useState(0);
  const update = useCallback(() => setState(uuid()), []);

  console.log('update');

  useEffect(() => {
    return () => {
      //组件卸载就删除回调，避免产生无意义的缓存
      CALLBACKS[a.storeId].delete(update)
    }
  }, [])

  return [
    a.getValue(update),
    a.setValue
  ]
}

export const atom = (initValue) => {
  const storeId = uuid()
  STATE[storeId] = initValue;
  return {
    getValue(callback) {
      let set = CALLBACKS[storeId]
      if (!set) {
        set = new Set();
        CALLBACKS[storeId] = set;
      }
      set.add(callback)
      return STATE[storeId];
    },
    setValue(value) {
      //比较即将设置的值和已经缓存的值 相同不做处理
      if (value === CALLBACKS[storeId]) {
        return
      }
      STATE[storeId] = value;
      CALLBACKS[storeId].forEach(func => func())
    },
    storeId
  }
}

export {

}
