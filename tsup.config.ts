import {defineConfig } from "tsup"
export default defineConfig({
    entry:['./src/index.ts'],
    outExtension:(ctx)=>({js:`.${ctx.format}.js`}),
    format:['esm','iife','cjs'],
    dts:true,
    minify:true,
    clean:true,
    sourcemap:true,
})