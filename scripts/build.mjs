import { build } from 'esbuild'
import { builtinModules } from 'module'

const minify = process.argv.includes('--minify')

export const baseBuildOpts = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    minify,
    external: [
        ...builtinModules,
        'pdf-parse',
        'jsdom',
    ],
}

export const commonJsBuildOpts = {
    format: 'cjs',
    outfile: 'dist/index.cjs',
}

export const esmBuildOpts = {
    format: 'esm',
    outfile: 'dist/index.mjs',
}

export const builds = [
    { ...baseBuildOpts, ...commonJsBuildOpts },
    { ...baseBuildOpts, ...esmBuildOpts },
]

export async function main() {
    await Promise.all(builds.map(async (opts) => {
        console.log(`Building ${opts.format}...`)
        await build(opts)
        console.log(`Built ${opts.outfile}`)
    }))
}

main()