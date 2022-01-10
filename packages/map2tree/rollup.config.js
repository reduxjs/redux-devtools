import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: {
      name: 'map2tree',
      file: 'dist/map2tree.umd.js',
      format: 'umd',
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'map2tree',
      file: 'dist/map2tree.umd.min.js',
      format: 'umd',
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/map2tree.cjs.js', format: 'cjs' },
      { file: 'dist/map2tree.esm.js', format: 'esm' },
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: [/@babel\/runtime/, /lodash/],
  },
];

export default config;
