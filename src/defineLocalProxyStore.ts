import React, {useEffect, createContext, useContext, useMemo} from "react";
import {uuid} from "./utils";
import {defineProxyStore} from "./defineProxyStore";


export function defineLocalProxyStore(options) {

    let RenderComponent;

    const stores = {};
    const context = createContext({id: undefined});

    function useStore() {
        const contextState = useContext(context);
        if (contextState.id == undefined) {
            console.warn('被包装的组件没有渲染')
        }
        console.log(stores)
        return stores[contextState.id]()
    }

    Object.assign(useStore, {
        //组件包装
        $wrapper(Component) {
            if (RenderComponent != undefined) {
                console.warn('RenderComponent只能包装一个组件')
            }
            RenderComponent = Component;
            return (props) => {

                const id = useMemo(() => {
                    const id = uuid();
                    stores[id] = defineProxyStore({...options, id});
                    return id
                }, []);

                useEffect(() => () => {
                    stores[id]?.$destroy();
                    delete stores[id]
                }, [])

                return React.createElement(context.Provider, {
                        value: {id},
                        children: React.createElement(RenderComponent, {...props})
                    }
                )
            }
        },
    })

    return useStore;
}
