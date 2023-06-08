import {useMemo, useState} from "react";

/**
 * 强制刷新组件
 */
export const useForceUpdate = () => {
    const [_, forceUpdate] = useState({});

    return useMemo(() => () => forceUpdate({}), [])
}
