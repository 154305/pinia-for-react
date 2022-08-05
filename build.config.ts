import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        'src/index',
    ],
    clean: true,
    declaration: true,
    externals:[
        'react'
    ],
    rollup: {
        emitCJS: true,
        inlineDependencies: true,
    },
})