import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: {
      name: 'd3-state-visualizer',
      file: 'dist/d3-state-visualizer.umd.js',
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
      name: 'd3-state-visualizer',
      file: 'dist/d3-state-visualizer.umd.min.js',
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
      { file: 'dist/d3-state-visualizer.cjs.js', format: 'cjs' },
      { file: 'dist/d3-state-visualizer.esm.js', format: 'esm' },
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: [
      /@babel\/runtime/,
      'd3',
      'ramda',
      'map2tree',
      'deepmerge',
      'd3tooltip',
    ],
  },
];

export default config;
