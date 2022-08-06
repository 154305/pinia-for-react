import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
    entries: [
        { builder: "mkdist", input: "src", name: "ReactPiniaStore", outDir: "dist/cjs", ext: "js", format: "cjs",declaration:false },
        { builder: "mkdist", input: "src", outDir: "dist/esm", ext: "js", format: "esm",declaration:false},
    ],
    clean: true,
    declaration: true,
    externals: [
        'react'
    ],
    rollup: {
        emitCJS: true,
        inlineDependencies: true,
    },
})