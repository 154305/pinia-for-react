import {useReactive} from "./index";

export const useRefState = (value) => {

    const state = useReactive({
        value
    })

    return state
}

export default useRefState;
