import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import multi from '@rollup/plugin-multi-entry';

export default {
    input: 'tests/**/*.ts',
    output: {
        file: 'dist_tests/tests.js',
        format: 'iife',
        name: 'SafeContentScriptsTests',
        sourcemap: true,
    },
    plugins: [
        multi(),
        resolve(),
        typescript(),
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env'],
        }),
    ]
};
