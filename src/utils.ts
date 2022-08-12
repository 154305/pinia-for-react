//主要是为了防止外层解构导致this丢失
export const functionMapBindContext = (context: any, functionMap: Record<string, Function>) => {
    const bindActionsFunctions = {} as Record<string, Function>
    Object.entries(functionMap).map(([key, func]) => bindActionsFunctions[key] = (...args) => func.apply(context, args))
    return bindActionsFunctions
}