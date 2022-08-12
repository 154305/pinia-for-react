import {isObject} from "lodash-es";

const proxyMap = new WeakMap();

function observer<T extends Record<string, any>>(initialVal: T, cb: () => void): T {
    const cacheProxy = proxyMap.get(initialVal);
    if (cacheProxy) return cacheProxy;
    const proxy = new Proxy(initialVal, {
        get(target: T, key: string | symbol, receiver: any): any {
            const res = Reflect.get(target, key, receiver);
            return isObject(res) ? observer(res, cb) : Reflect.get(target, key, receiver);
        },
        set(target: T, key: any, receiver: any): boolean {
            const ret = Reflect.set(target, key, receiver);
            cb();
            return ret;
        },
        defineProperty(target: T, key: string | symbol, attributes: PropertyDescriptor): boolean {
            const ret = Reflect.defineProperty(target, key, attributes);
            cb();
            return ret;
        },
        deleteProperty(target: T, p: string | symbol) {
            cb();
            return true
        }
    });
    proxyMap.set(initialVal, proxy);
    return proxy;
}

export default observer