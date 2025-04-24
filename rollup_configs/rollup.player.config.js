import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/japanese_video_player.ts',
  output: {
    file: 'dist/japanese_video_player.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    json(),
    resolve(),
    typescript({
      target: 'es2020',
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    }),
    commonjs(), 
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      presets: [
        ['@babel/preset-env', { targets: 'defaults' }]
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      preventAssignment: true,
    }),
  ]
};
